const { v4: uuidv4 } = require("uuid");
const request = require('request-promise');
const { MongoClient, Db } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, REACT_APP_OMDB_KEY } = process.env;
const moment = require('moment');  

const options = { 
    useNewURLParser: true,
    useUnifiedTopology: true
}

//add Point post to Tangent
const addPointToTangent = async (req, res) => {

    const { _id, title, type, coverImgSrc, year, by, description, link, currentUserId, currentTangentId } = req.body;

    if (!_id || !title || !type || !currentUserId || !currentTangentId) {
        return res.status(400).json({status: 400, message: "Incomplete information -- cannot create Point.", data: req.body});
    }

    const pointsClient = new MongoClient(MONGO_URI, options);
    const tangentsClient = new MongoClient(MONGO_URI, options);
    const usersClient = new MongoClient(MONGO_URI, options);

    try {

        //first, check if this Point is already mentioned in the Tangent
        await tangentsClient.connect();
        const tangentsDb = tangentsClient.db("TANGENTS");

        //get latest post in the tangent
        const latestPost = await tangentsDb.collection(currentTangentId).find().sort({_id:-1}).limit(1).toArray();
        
        //get the tangentPoints array and check if the Point Id is already in there
        const alreadyMentioned = latestPost[0].tangentPoints.some((point) => point === _id);

        if (alreadyMentioned) {
            return res.status(400).json({status: 400, message: "Point is already in this Tangent!", data: _id});
        }

        //check if Point already exists in database 
        await pointsClient.connect();
        const pointsDb = pointsClient.db("POINTS");
        const existingPoint = await pointsDb.collection(type).findOne({_id: _id});

        //if so, update the tangents array of this Point
        if (existingPoint) {
            //only add the tangentId if it isn't already in the tangents array (points may be mentioned more than once in a Tangent)
            if (existingPoint.mentionedIn.indexOf(currentTangentId) === -1) {
                const updatedTangents = [...existingPoint.mentionedIn, currentTangentId];
                
                const pointUpdate = await pointsDb.collection(type).updateOne({_id: _id}, {$set: {mentionedIn: updatedTangents}});
               
                if (pointUpdate.matchedCount !== 1 || pointUpdate.modifiedCount !== 1) {
                    return res.status(500).json({ status: 500, message: "Could not update Point due to server error. Please try your request again.", data: req.body});
                }
            }
           
        }
        //else create a new Point
        else {
        
            //create new Point, adding the currentTangentId to its list of mentions
            const newPoint = {
                _id: _id, 
                title: title, 
                type: type, 
                coverImgSrc: coverImgSrc,
                year: year, 
                by: by, 
                description: description,
                link: link, 
                mentionedIn: [currentTangentId]
            }

            const addPoint = await pointsDb.collection(type).insertOne(newPoint);
            //if Point is not added to the Points database
            if (!addPoint.acknowledged) {
                return res.status(500).json({status: 500, message: "Point not added due to server error. Please try again.", data: req.body});
            }
        }
        //after a new Point is successfully added to the database or the mentionedIn array of an existing Point is successfully updated,
        //we still need to add this new post to the Tangent (i.e. a new document in the current Tangent collection)
    
        //latestPost has been fetched above
        //if the current user is not already in the usersInTangent array (i.e. this is their first post in this Tangent)
        //then add their id to this array, then update the tangents array for the user in the USERS database
        let updatedUsersInTangent = latestPost[0].usersInTangent;
        
        await usersClient.connect();
        const usersDb = usersClient.db("USERS");
        
        //update user in USERS database
        if (!(latestPost[0].usersInTangent.includes(currentUserId))) {
            updatedUsersInTangent.push(currentUserId);
            

            //update the user's Tangent list
            const user = await usersDb.collection("users").findOne({_id: currentUserId});
            const userTangents = user.tangents;

            const updatedTangents = [...userTangents, currentTangentId];
            const update1 = await usersDb.collection("users").updateOne({_id: currentUserId}, { $set: { tangents: updatedTangents}});
        }
        
        //add the Point id to the tangentPoints array (if it is not there already)
        let updatedTangentPoints = null;
        if (latestPost[0].tangentPoints.indexOf(_id) === -1) {
            updatedTangentPoints = [...latestPost[0].tangentPoints, _id];
        }
        else {
            updatedTangentPoints = latestPost[0].tangentPoints;
        }
        
        //increment the tangentLength by 1
        const newTangentLength = Number(latestPost[0].tangentLength)+1;

        //we will be using the autogenerated mongodb ObjectId as _id for each post because 
        //we can sort with it to order the posts by time
        const newPost = {
            tangentId: currentTangentId,
            tangentName: latestPost[0].tangentName, 
            usersInTangent: updatedUsersInTangent, 
            tangentPoints: updatedTangentPoints, 
            tangentLength: newTangentLength, 
            userId: currentUserId, 
            timestamp: moment().format("YYYY-MM-DD HH:mm"), 
            pointId: _id
        }

        const result = await tangentsDb.collection(currentTangentId).insertOne(newPost);
        
        if (!result) {
            return res.status(500).json({status: 500, message: "Point not added to Tangent due to server error. Please try again.", data: req.body})
        }

        //In the user's database, also add this post to the user's latestPosts array 
        //(list of the user's most recent posts in all the Tangents they are a part of)
 
        const user = await usersDb.collection("users").findOne({_id: currentUserId});
        let userLastPosts = user.lastPosts;

        //replace the latest post listed for the current Tangent Id in the array with this post just made
        let newLasts = userLastPosts.filter((post) => post.tangentId !== currentTangentId);
        newLasts.push(newPost);

        const update2 = await usersDb.collection("users").updateOne({_id: currentUserId}, { $set: { lastPosts: newLasts}});

        return res.status(200).json({status: 200, message: "Point added successfully to Tangent", data: result.insertedId});
    }

    catch (err) {
        res.status(500).json({status: 500, message: `Point not added to Tangent due to unknown server error: ${err}. Please try again.`, data: req.body})
    }

    finally {
        pointsClient.close();
        tangentsClient.close();
        usersClient.close();
    }
}

//add text post to Tangent
const addMessageToTangent = async (req, res) => {

    // const { currentTangentId } = req.params;
    const { currentUserId, text, currentTangentId } = req.body;

    if (!text || !currentTangentId || !currentUserId) {
        return res.status(400).json({status: 400, message: "Incomplete information -- cannot create post.", data: req.body});
    }

    const tangentsClient = new MongoClient(MONGO_URI, options);
    const usersClient = new MongoClient(MONGO_URI, options);

    try {
        await tangentsClient.connect();

        const tangentsDb = tangentsClient.db("TANGENTS");

        //add case if tangentId invalid? won't really happen on front end

        //get latest post in the tangent
        const latestPost = await tangentsDb.collection(currentTangentId).find().sort({_id: -1}).limit(1).toArray();

        //if the current user is not already in the usersInTangent array (i.e. this is their first post in this Tangent)
        //then add their id to this array, then update the tangents array for the user in the USERS database
        
        await usersClient.connect();
        const usersDb = usersClient.db("USERS");

        let updatedUsersInTangent = latestPost[0].usersInTangent;
    
        if (!latestPost[0].usersInTangent.includes(currentUserId)) {
            updatedUsersInTangent.push(currentUserId);
            
            //update user in USERS database

            const user = await usersDb.collection("users").findOne({_id: currentUserId});
            const userTangents = user.tangents;
            
            const updatedTangents = [...userTangents, currentTangentId];
            const update = await usersDb.collection("users").updateOne({_id: currentUserId}, { $set: { tangents: updatedTangents}});
        }
        
        //increment the tangentLength by 1
        const newTangentLength = Number(latestPost[0].tangentLength)+1;

        //we will be using the autogenerated mongodb ObjectId as _id for each post because 
        //we can sort with it to order the posts by time
        const newPost = {
            tangentId: currentTangentId,
            tangentName: latestPost[0].tangentName, 
            usersInTangent: updatedUsersInTangent, 
            tangentPoints: latestPost[0].tangentPoints,
            tangentLength: newTangentLength, 
            userId: currentUserId, 
            timestamp: moment().format("YYYY-MM-DD HH:mm"), 
            text: text
        }

        const result = await tangentsDb.collection(currentTangentId).insertOne(newPost);

        if (!result) {
            return res.status(500).json({status: 500, message: "Post not added to Tangent due to server error. Please try again.", data: req.body})
        }
       
        //In the user's database, also add this post to the user's latestPosts array 
        //(list of the user's most recent posts in all the Tangents they are a part of)
 
        const user = await usersDb.collection("users").findOne({_id: currentUserId});
        const userLastPosts = user.lastPosts;

        //replace the latest post listed for the current Tangent Id in the array with this post just made
        let newLasts = userLastPosts.filter((post) => post.tangentId !== currentTangentId);
        newLasts.push(newPost);

        const update2 = await usersDb.collection("users").updateOne({_id: currentUserId}, { $set: { lastPosts: newLasts}});

        res.status(200).json({status: 200, message: "Post added successfully to Tangent", data: result.insertedId})

    }

    catch (err) {
        res.status(500).json({status: 500, message: `Post not added to Tangent due to unknown server error: ${err}. Please try again.`, data: req.body})
    }

    finally {
        tangentsClient.close();
        usersClient.close();
    }

}

//create a new Tangent
const addTangent = async (req, res) => {
    
    //note the first post of a tangent must be a text, not a Point post
    const { tangentName, currentUserId, text } = req.body;

    if (!tangentName || !currentUserId || !text ) {
        return res.status(400).json({status: 400, message: "Incomplete information, cannot create new Tangent.", data: req.body});
    }

    const tangentsClient = new MongoClient(MONGO_URI, options);
    const usersClient = new MongoClient(MONGO_URI, options);

    try {
        await tangentsClient.connect();
        
        const tangentsDb = tangentsClient.db("TANGENTS");
        
        //generate random Tangent id 
        const tangentId = uuidv4();

        //first post of new Tangent
        const newPost = {
            tangentId: tangentId,
            tangentName: tangentName, 
            usersInTangent: [currentUserId], 
            tangentPoints: [], 
            tangentLength: 1, 
            userId: currentUserId, 
            timestamp: moment().format("YYYY-MM-DD HH:mm"), 
            text: text
        }

        //create collection in TANGENTS database
        const result = await tangentsDb.collection(tangentId).insertOne(newPost);

        //if Tangent is not added successfully
        if (!result.acknowledged) {
            return res.status(500).json({status: 500, message: "Tangent not added due to server error. Please try again.", data: req.body});
        }

        //if Tangent is added successfully, add tangent to tangents array for the current user
        await usersClient.connect();

        const usersDb = usersClient.db("USERS");

        //get tangents and lastPosts arrays for the current user
        const user = await usersDb.collection("users").findOne({_id: currentUserId});

        const updatedTangents = [...user.tangents, tangentId];

        const updatedLastPosts = [...user.lastPosts, newPost];

        const updatedResult = await usersDb.collection("users").updateOne({_id: currentUserId}, { $set: {tangents: updatedTangents, lastPosts: updatedLastPosts}});

        if (updatedResult.matchedCount !== 1) {
            return res.status(404).json({status: 404, message: "User not found.", data: req.body});
        }
        else if (updatedResult.modifiedCount !== 1) {
            return res.status(500).json({ status: 500, message: "Could not add Tangent to user profile. Please try your request again.", data: req.body});
        }
        
        res.status(200).json({status: 200, message: "Tangent created successfully.", data: tangentId})
 
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Tangent not created due to unknown server error. Please try again.", data: req.body})
    }

    finally { 
        tangentsClient.close();
        usersClient.close();
    }
}

module.exports = { addPointToTangent, addMessageToTangent, addTangent };