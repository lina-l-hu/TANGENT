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

    if (!tangentId) {
        return res.status(400).json({status: 400, message: "Bad request - missing Tangent id."});
    }

    try {
        await client.connect();
        const db = client.db("TANGENTS");

        const tangent = await db.collection(tangentId).find().toArray();

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
                const point = await pointsDb.collection(type).findOne({_id : id});
                tangentPoints.push(point);
            })
        )

        console.log("points in tangent", tangentPoints);

        (!tangentPoints) ?
            res.status(404).json({status: 404, message: "Could not find Points.", data: _id})
            : res.status(200).json({status: 200, message: "Points in Tangent retrieved successfully.", data: tangentPoints});
    }

    catch (err) {
        res.status(500).json({status: 500, message: `Points in Tangent not retrieved due to unknown server error: ${err}. Please try again.`, data: req.headers})
    }

    finally {
        tangentsClient.close();
        pointsClient.close();
    }
    
}

//get all user objects in Tangent given tangent id
const getUsersInTangent = async (req, res) => {
    const { _id } = req.headers;

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
                const user = await usersDb.collection("users").findOne({_id : id});
                tangentUsers.push(user);
            })
        )

        console.log("users in tangent", tangentUsers);

        (!tangentUsers) ?
            res.status(404).json({status: 404, message: "Could not find users in Tangent.", data: _id})
            : res.status(200).json({status: 200, message: "Users in Tangent retrieved successfully.", data: tangentUsers});
    }

    catch (err) {
        res.status(500).json({status: 500, message: `Users in Tangent not retrieved due to unknown server error: ${err}. Please try again.`, data: req.headers})
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

    const usersClient = new MongoClient(MONGO_URI, options);
    const tangentsClient = new MongoClient(MONGO_URI, options);

    try {
        await usersClient.connect();
        const usersDb = usersClient.db("USERS");

        //get the user's circle ids
        const user = await usersDb.collection("users").findOne({_id : _id});
        
        if (!user) {
            return res.status(404).json({status: 404, message: "User not found.", data: _id});
        }

        const circleIds = user.circle;

        if (circleIds.length === 0) {
            return res.status(404).json({status: 404, message: "No users in circle.", data: []});
        }

        //get all the tangents arrays and merge into one array
        const allCircleTangentIds = []; 
        await Promise.all (
            circleIds.map( async (id) => {
                const friend = await usersDb.collection("users").findOne({_id : id});

                if (friend) {
                    const tangentIds = friend.tangents;
                    allCircleTangentIds.push(...tangentIds);
                }
                
            })
        )

        //merge the current user's tangents array into this array as well
        allCircleTangentIds.push(...user.tangents);

        //reduce set to only unique tangent ids
        const uniqueTangentIds = [...new Set(allCircleTangentIds)];

        //get the latest post for each tangent
        await tangentsClient.connect();
        const tangentsDb = tangentsClient.db("TANGENTS");

        const latestPostArray = [];
        await Promise.all (
            uniqueTangentIds.map( async (id) => {
                //this is an array so need to access [0]
                const latestPost = await tangentsDb.collection(id).find().sort({_id:-1}).limit(1).toArray();

                if (latestPost !== undefined ) {
                    latestPostArray.push(latestPost[0]);
                }
            })
        )

        //sort all the latest posts by descending tangentLength
        let sorted  = latestPostArray.sort((a, b) => {
            return b.tangentLength - a.tangentLength;
        })


        //take the last post that is not a point post
        const firstMessagePost = sorted.find((post) => (Object.keys(post).indexOf("text") > -1));

        //get the user object associated with the post to return
        const postUser = await usersDb.collection("users").findOne({_id : firstMessagePost.userId});
        
        const objectToReturn = {...firstMessagePost, username: postUser.username, avatar: postUser.avatar}

        console.log("tangent to return", objectToReturn);

        //return the post with greatest tangentLength
        (objectToReturn) ? 
            res.status(200).json({status: 200, message: "Successfully retrieved most popular Tangent.", data: objectToReturn})
            : res.status(404).json({status: 404, message: "Could not find the most popular Tangent.", data: _id});
    }

    catch (err) {
        res.status(500).json({status: 500, message: `Most popular Tangent not retrieved due to unknown server error: ${err}. Please try again.`, data: _id})
    }

    finally {
        usersClient.close();
        tangentsClient.close();
    }
}

//the 3 most recently active Tangents in the user's circle
const getMostRecentTangents = async (req, res) => {
    //current user id
    const { _id } = req.headers;

    const usersClient = new MongoClient(MONGO_URI, options);
    const tangentsClient = new MongoClient(MONGO_URI, options);

    try {
        await usersClient.connect();
        const usersDb = usersClient.db("USERS");

        //get the user's circle ids
        const user = await usersDb.collection("users").findOne({_id : _id});
        
        if (!user) {
            return res.status(404).json({status: 404, message: "User not found.", data: _id});
        }

        const circleIds = user.circle;

        if (circleIds.length === 0) {
            return res.status(404).json({status: 404, message: "No users in circle.", data: []});
        }

        //get all the tangents arrays and merge into one array
        const allCircleTangentIds = []; 
        await Promise.all (
            circleIds.map( async (id) => {
                const friend = await usersDb.collection("users").findOne({_id : id});

                if (friend) {
                    const tangentIds = friend.tangents;
                    allCircleTangentIds.push(...tangentIds);
                }
                
            })
        )

        //merge the current user's tangents array into this array as well
        // allCircleTangentIds.push(...user.tangents);

       //reduce set to only unique tangent ids
        const uniqueTangentIds = [...new Set(allCircleTangentIds)];

        //get the latest post for each tangent
        await tangentsClient.connect();
        const tangentsDb = tangentsClient.db("TANGENTS");

        const latestPostArray = [];
        await Promise.all (
            uniqueTangentIds.map( async (id) => {
                //this is an array so need to access [0]
                const latestPost = await tangentsDb.collection(id).find().sort({_id:-1}).limit(1).toArray();

                if (latestPost !== undefined ) {
                    latestPostArray.push(latestPost[0]);
                }
            })
        )

        //sort this array by descending timestamp
        let sorted  = latestPostArray.sort((a, b) => {
            let da = new Date(a.timestamp);
            let db = new Date(b.timestamp);
            return db-da;
        })

        //find the most recent post that is not a point post
        const firstMessagePost = sorted.find((post) => (Object.keys(post).indexOf("text") > -1));

        //will return only the 3 most recent posts that are texts (not Points)
        const latestThreePosts = [firstMessagePost];

        for (let i = 1; i < sorted.length; i++) {
            if (latestThreePosts.length === 3 || i === sorted.length-1) {
                break;
            }
            
            if (Object.keys(sorted[i]).indexOf("text") > -1) {
                latestThreePosts.push(sorted[i]);
            }
            
        }
        
        //get all the user objects associated with each of these posts
        const postUsers = latestThreePosts.map((post) => post.userId);

        const usersToReturn = [];
    
        await Promise.all (
            postUsers.map( async (id) => {
                let user = await usersDb.collection("users").findOne({_id : id});
                usersToReturn.push(user);
            })
        )

        //add user info to each post
        latestThreePosts.forEach((post, index) => {
            post.username = usersToReturn[index].username;
            post.avatar = usersToReturn[index].avatar;
        })

        console.log("latest posts", latestThreePosts);

        //return the 3 latest posts
        (latestThreePosts) ? 
            res.status(200).json({status: 200, message: "Successfully retrieved latest Tangents.", data: latestThreePosts})
            : res.status(404).json({status: 404, message: "Could not retrieve the latest Tangents.", data: _id});
    }

    catch (err) {
        res.status(500).json({status: 500, message: `Latest Tangents not retrieved due to unknown server error: ${err}. Please try again.`, data: _id})
    }

    finally {
        usersClient.close();
        tangentsClient.close();
    }
}

//get latest post for each of the tangents in the provided array
//used for the tangents (list of chats) page, pass in user.tangents array
//for point detail page, pass in point.mentionedIn array
const getLatestPosts = async (req, res) => {
   
    const { tangentids } = req.headers;

    //array must be sent as a string in the header
    let idArray = [];
    if (tangentids.indexOf(",") === -1) {
        idArray = [tangentids];
    }
    else {
        idArray = tangentids.split(",");
    }


    if (!tangentids) {
        return res.status(400).json({status: 400, message: "Bad request - no Tangent ids provided."});
    }

    const client = new MongoClient(MONGO_URI, options);

    try {
        await client.connect();
        const db = client.db("TANGENTS");

        const latestPosts = [];

        await Promise.all (
            idArray.map( async (tangent) => {
                const latest = await db.collection(tangent).find().sort({_id:-1}).limit(1).toArray();
                if (latest[0]) {
                    latestPosts.push(latest[0]);
                }
            })
        )
       
        if (!latestPosts) {
            return res.status(404).json({status: 404, message: "Could not find Tangents.", data: tangentids});
        }

        // sort the latestPosts array to make sure it is ordered with the most recent first
        const sortedByTime = latestPosts.sort((a, b) => {
            let da = new Date(a.timestamp);
            let db = new Date(b.timestamp);
            return db-da;
        });
 
        console.log("sorted latest posts", sortedByTime);
        
        res.status(200).json({status: 200, message: "Latest Tangent posts retrieved successfully.", data: sortedByTime});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Latest Tangent posts not retrieved due to unknown server error. Please try again.", data: tangentids})
    }

    finally {
        client.close();
    }

}

module.exports = { getTangent, getPointsInTangent, getMostPopularTangent, 
    getMostRecentTangents, getLatestPosts, getUsersInTangent};