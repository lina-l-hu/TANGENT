//TANGENTS database handlers

const { v4: uuidv4 } = require("uuid");
const moment = require('moment');  
const request = require('request-promise');
const { MongoClient, Db } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, REACT_APP_OMDB_KEY } = process.env;

const options = { 
    useNewURLParser: true,
    useUnifiedTopology: true
}

//get Tangent by id
const getTangent = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);

    const { tangentId } = req.params;
    console.log(tangentId);

    if (!tangentId) {
        return res.status(400).json({status: 400, message: "Bad request - missing Tangent id."});
    }

    try {
        await client.connect();
        const db = client.db("TANGENTS");

        const tangent = await db.collection(tangentId).find().toArray();

        console.log("tang in get TAngent", tangent);

        if (tangent.length === 0) {
            return res.status(404).json({status: 404, message: "Tangent not found.", data: tangentId});
        }
        
        res.status(200).json({status: 200, message: "Tangent retrieved successfully.", data: tangent});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Tangent not retrieved due to unknown server error. Please try again.", data: _id})
    }

    finally {
        client.close();
    }
}

const getPointsInTangent = async (req, res) => {
    const { _id } = req.headers;

    console.log("tangentId",  _id)
    
    if (! _id) {
        return res.status(400).json({status: 400, message: "Bad request - missing Tangent id."});
    }

    const client = new MongoClient(MONGO_URI, options);

    try {
        await client.connect();
        const db = client.db("TANGENTS");

        //get the points array in the last inserted post (document) in the Tangent
        const latestPost = await db.collection(_id).find().sort({_id:-1}).limit(1).toArray();

        console.log("latestPO", latestPost)
        if (!latestPost) {
            return res.status(404).json({status: 404, message: "Tangent not found.", data: req.headers});
        }

        res.status(200).json({status: 200, message: "Points in Tangent retrieved successfully.", data: latestPost[0].tangentPoints});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Points in Tangent not retrieved due to unknown server error. Please try again.", data: req.headers})
    }

    finally {
        client.close();
    }
    
}

const getMostPopularTangent = async (req, res) => {
    //get length from the latest posts in all of the user's circle's tangents
    //return that one or fetch anew??
}

//first post has most recent timestamp and one of the user's is a friend
//get last N documents in database
const getMostRecentTangents = async (req, res) => {
    
}

//get latest post for each of the tangents in the provided array
//used for the tangents (list of chats) page 
const getLatestPosts = async (req, res) => {
   
    const { tangentids } = req.headers;

    console.log("tangids in header", tangentids)
    //array must be sent as a string in the header
    const idArray = tangentids.split(",");
    console.log("idarar", idArray);

    if (!tangentids) {
        return res.status(400).json({status: 400, message: "Bad request - no Tangent ids provided."});
    }

    const client = new MongoClient(MONGO_URI, options);

    try {
        await client.connect();
        const db = client.db("TANGENTS");

        console.log("connected")
        const latestPosts = [];

        await Promise.all (
            idArray.map( async (tangent) => {
                console.log('in here', tangent);
                const latest = await db.collection(tangent).find().sort({_id:-1}).limit(1).toArray();
                latestPosts.push(latest[0]);
            })
        )
       
        console.log("latestPO array", latestPosts)
        if (!latestPosts) {
            return res.status(404).json({status: 404, message: "Could not find Tangents.", data: tangentids});
        }

        // sort the latestPosts array to make sure it is ordered with the most recent first
        const sortedByTime = latestPosts.sort((a, b) => {
            let da = new Date(a.timestamp);
            let db = new Date(b.timestamp);
            return db-da;
        });
 
        res.status(200).json({status: 200, message: "Points in Tangent retrieved successfully.", data: sortedByTime});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Points in Tangent not retrieved due to unknown server error. Please try again.", data: tangentids})
    }

    finally {
        client.close();
    }

}

module.exports = { getTangent, getPointsInTangent, getMostPopularTangent, 
    getMostRecentTangents, getLatestPosts };