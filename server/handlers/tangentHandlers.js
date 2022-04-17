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

    const tangentsClient = new MongoClient(MONGO_URI, options);
    const pointsClient = new MongoClient(MONGO_URI, options);

    try {
        await tangentsClient.connect();
        const tangentsDb = tangentsClient.db("TANGENTS");

        //get the points array in the last inserted post (document) in the Tangent
        const latestPost = await tangentsDb.collection(_id).find().sort({_id:-1}).limit(1).toArray();

        console.log("latestPO", latestPost)
        if (!latestPost) {
            return res.status(404).json({status: 404, message: "Tangent not found.", data: req.headers});
        }

        const pointsList = latestPost[0].tangentPoints;

        //fetch each of the points in the id list from the POINTS database
        await pointsClient.connect();
        const pointsDb = pointsClient.db("POINTS");

        const tangentPoints = []; 
        await Promise.all (
            pointsList.map( async (id) => {
                let type = (id.charAt(0) === "t") ? "film" : "book";
                console.log('in here', id, type);
                const point = await pointsDb.collection(type).findOne({_id : id});
                tangentPoints.push(point);
            })
        )

        console.log("tangentPoints", tangentPoints);

        (!tangentPoints) ?
            res.status(404).json({status: 404, message: "Could not find Points.", data: _id})
            : res.status(200).json({status: 200, message: "Points in Tangent retrieved successfully.", data: tangentPoints});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Points in Tangent not retrieved due to unknown server error. Please try again.", data: req.headers})
    }

    finally {
        tangentsClient.close();
        pointsClient.close();
    }
    
}

//get all user objects in Tangent given tangent id
const getUsersInTangent = async (req, res) => {
    const { _id } = req.headers;

    console.log("tangentId",  _id)
    
    if (! _id) {
        return res.status(400).json({status: 400, message: "Bad request - missing Tangent id."});
    }

    const tangentsClient = new MongoClient(MONGO_URI, options);
    const usersClient = new MongoClient(MONGO_URI, options);

    try {
        await tangentsClient.connect();
        const tangentsDb = tangentsClient.db("TANGENTS");

        //get the users array in the last inserted post (document) in the Tangent
        const latestPost = await tangentsDb.collection(_id).find().sort({_id:-1}).limit(1).toArray();

        console.log("latestPO", latestPost)
        if (!latestPost) {
            return res.status(404).json({status: 404, message: "Tangent not found.", data: req.headers});
        }

        const usersList = latestPost[0].usersInTangent;

        //fetch each of the points in the id list from the POINTS database
        await usersClient.connect();
        const usersDb = usersClient.db("USERS");

        const tangentUsers = []; 
        await Promise.all (
            usersList.map( async (id) => {
                console.log('in here', id);
                const user = await usersDb.collection("users").findOne({_id : id});
                tangentUsers.push(user);
            })
        )

        console.log("tangentUSERs", tangentUsers);

        (!tangentUsers) ?
            res.status(404).json({status: 404, message: "Could not find users in Tangent.", data: _id})
            : res.status(200).json({status: 200, message: "Users in Tangent retrieved successfully.", data: tangentUsers});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Points in Tangent not retrieved due to unknown server error. Please try again.", data: req.headers})
    }

    finally {
        tangentsClient.close();
        usersClient.close();
    }
    
}

//get the Tangent with the most posts in the user's circle
const getMostPopularTangent = async (req, res) => {
    //current user id
    const { _id } = req.headers;
    console.log ("id", _id);

    const client = new MongoClient(MONGO_URI, options);

    try {
        await client.connect();
        const db = client.db("USERS");
        console.log("connected");

        //get the user's circle ids
        const user = await db.collection("users").findOne({_id : _id});
        
        console.log("user", user);
        if (!user) {
            return res.status(404).json({status: 404, message: "User not found.", data: _id});
        }

        const circleIds = user.circle;
        console.log("circleIds", circleIds);

        //for each of the users in the Circle, get their lastPosts array and merge into one array
        const allCircleLastPosts = []; 
        await Promise.all (
            circleIds.map( async (id) => {
                const friend = await db.collection("users").findOne({_id : id});
                console.log("friend", friend)
                const friendLastPosts = friend.lastPosts;
                console.log("friend lastPosts", friendLastPosts)
                allCircleLastPosts.push(...friendLastPosts);
            })
        )

        //merge the current user's lastPosts array into the array as well
        allCircleLastPosts.push(...user.lastPosts);

        console.log("all circle last posts", allCircleLastPosts);
       
        //sort this array by descending tangentLength
        let sorted  = allCircleLastPosts.sort((a, b) => {
            return b.tangentLength - a.tangentLength;
        })

        console.log("sorted", sorted);
        
        //return the post with greatest tangentLength
        (sorted) ? 
            res.status(200).json({status: 200, message: "Successfully retrieved most popular Tangent.", data: sorted[0]})
            : res.status(404).json({status: 404, message: "Could not find the most popular Tangent.", data: _id});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Most popular Tangent not retrieved due to unknown server error. Please try again.", data: _id})
    }

    finally {
        client.close();
    }
}

//the 3 most recently active Tangents in the user's circle
const getMostRecentTangents = async (req, res) => {
    //current user id
    const { _id } = req.headers;
    console.log ("id", _id);

    const client = new MongoClient(MONGO_URI, options);

    try {
        await client.connect();
        const db = client.db("USERS");
        console.log("connected");

        //get the user's circle ids
        const user = await db.collection("users").findOne({_id : _id});
        
        console.log("user", user);
        if (!user) {
            return res.status(404).json({status: 404, message: "User not found.", data: _id});
        }

        const circleIds = user.circle;
        console.log("circleIds", circleIds);

        //for each of the users in the Circle, get their lastPosts array and merge into one array
        const allCircleLastPosts = []; 
        await Promise.all (
            circleIds.map( async (id) => {
                const friend = await db.collection("users").findOne({_id : id});
                console.log("friend", friend)
                const friendLastPosts = friend.lastPosts;
                console.log("friend lastPosts", friendLastPosts)
                allCircleLastPosts.push(...friendLastPosts);
            })
        )

        //merge the current user's lastPosts array into the array as well
        allCircleLastPosts.push(...user.lastPosts);

        console.log("all circle last posts", allCircleLastPosts);
       
        //sort this array by descending timestamp
        let sorted  = allCircleLastPosts.sort((a, b) => {
            let da = new Date(a.timestamp);
            let db = new Date(b.timestamp);
            return db-da;
        })

        //will return only the 3 most recent last posts in unique Tangents (i.e. no posts from the same Tangent)
        const latestThreePosts = [sorted[0]];

        for (let i = 1; i < sorted.length; i++) {
            if (latestThreePosts.length === 3) {
                break;
            }

            let tangentIdsInThree = latestThreePosts.map((post) => post.tangentId);
            console.log("tangentsonly", tangentIdsInThree);

            if (tangentIdsInThree.indexOf(sorted[i].tangentId) === -1) {
                latestThreePosts.push(sorted[i]);
            }
        }
        
        console.log("latest3", latestThreePosts);
        
        //return the post with greatest tangentLength
        (sorted) ? 
            res.status(200).json({status: 200, message: "Successfully retrieved latest Tangents.", data: latestThreePosts})
            : res.status(404).json({status: 404, message: "Could not retrieve the latest Tangents.", data: _id});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Latest Tangents not retrieved due to unknown server error. Please try again.", data: _id})
    }

    finally {
        client.close();
    }
}

//get latest post for each of the tangents in the provided array
//used for the tangents (list of chats) page, pass in user.tangents array
//for point detail page, pass in point.mentionedIn array
const getLatestPosts = async (req, res) => {
   
    const { tangentids } = req.headers;

    console.log("tangids in header", tangentids)
    //array must be sent as a string in the header
    const idArray = null;
    if (tangentids.indexOf(",") === -1) {
        idArray = [tangentids];
    }
    else {
        idArray = tangentids.split(",");
    }

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
    getMostRecentTangents, getLatestPosts, getUsersInTangent};