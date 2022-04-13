const { v4: uuidv4 } = require("uuid");
const request = require('request-promise');
const { MongoClient, Db } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, REACT_APP_OMDB_KEY } = process.env;

const options = { 
    useNewURLParser: true,
    useUnifiedTopology: true
}

const getPoint = async (req, res) => {
    
    const { pointId } = req.params;
    console.log("pointId", pointId);
    
    if (!pointId) {
        return res.status(400).json({status: 400, message: "Bad request - missing Point id."});
    }

    let type = null;
    type = (pointId.charAt(0) === "t") ? "film" : "book";
    
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("POINTS");

        const point = await db.collection(type).findOne({_id : pointId})

        !point ?
            res.status(404).json({status: 404, message: "Point not found.", data: pointId})
            : res.status(200).json({status: 200, message: "Point retrieved successfully.", data: point});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Point not retrieved due to unknown server error. Please try again.", data: pointId})
    }

    finally {
        client.close();
    }
}

//in user's circle
const getMostPopularPoint = async (req, res) => {

}

module.exports = { getPoint, getMostPopularPoint };