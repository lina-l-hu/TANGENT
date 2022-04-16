const { v4: uuidv4 } = require("uuid");
const request = require('request-promise');
const { MongoClient, Db } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, REACT_APP_OMDB_KEY } = process.env;

const options = { 
    useNewURLParser: true,
    useUnifiedTopology: true
}

//receives an array of pointIds
const getPointsByIds = async (req, res) => {
    
    const { pointids } = req.headers;
    console.log("pointids", pointids);
    
    console.log("pointids in header", pointids)
    //array must be sent as a string in the header
    const idArray = pointids.split(",");
    console.log("idArray", idArray);

    if (!pointids) {
        return res.status(400).json({status: 400, message: "Bad request - no Point id provided."});
    }

    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("POINTS");

        const pointsToReturn = [];
        
        await Promise.all (
            idArray.map( async (id) => {
                let type = null;
                type = (id.charAt(0) === "t") ? "film" : "book";
                console.log("type", type)
                let point = await db.collection(type).findOne({_id : id});
                console.log("point", point)
                pointsToReturn.push(point);
            })
        )
        
        console.log("pointtoreturnarr", pointsToReturn);

        (!pointsToReturn) ?
            res.status(404).json({status: 404, message: "Point not found.", data: pointids})
            : res.status(200).json({status: 200, message: "Point retrieved successfully.", data: pointsToReturn});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Point not retrieved due to unknown server error. Please try again.", data: pointids})
    }

    finally {
        client.close();
    }
}

//in user's circle
const getMostPopularPoint = async (req, res) => {

}

module.exports = { getPointsByIds, getMostPopularPoint };