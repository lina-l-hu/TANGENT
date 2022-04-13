//USERS database handlers

const { v4: uuidv4 } = require("uuid");

const { MongoClient, Db } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = { 
    useNewURLParser: true,
    useUnifiedTopology: true
}

//get user by id 
const getUser = async (req, res) => {

    const client = new MongoClient(MONGO_URI, options);

    const { _id } = req.headers;

    if (!_id) {
        return res.status(400).json({status: 400, message: "Bad request - missing userId for user."});
    }

    try {
        await client.connect();
        const db = client.db("USERS");

        const user = await db.collection("users").findOne({_id : _id})

        !user ?
            res.status(404).json({status: 404, message: "User not found.", data: _id})
            : res.status(200).json({status: 200, message: "User retrieved successfully.", data: user});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "User not retrieved due to unknown server error. Please try again.", data: _id})
    }

    finally {
        client.close();
    }
}

//get all the Tangents the given user is a part of 
const getUserTangents = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);

    const { _id } = req.headers;
    console.log("_id", _id);

    if (!_id) {
        return res.status(400).json({status: 400, message: "Bad request - missing _id for user."});
    }

    try {
        await client.connect();
        const db = client.db("USERS");

        const user = await db.collection("users").findOne({_id : _id});
        //test this! 
        // const tangents = await db.collection("users").find({_id : _id}, {tangents: 1}).toArray();

        // (tangents.length === 0) ?
        !user ?
            res.status(404).json({status: 404, message: "User not found.", data: _id})
            : res.status(200).json({status: 200, message: "User Tangents retrieved successfully.", data: user.tangents});
            // : res.status(200).json({status: 200, message: "User Tangents retrieved successfully.", data: user.tangents});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "User Tangents not retrieved due to unknown server error. Please try again.", data: _id})
    }

    finally { 
        client.close();
    }
}

//get all the Points the given user has bookmarked
const getUserPoints = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);

    const { _id } = req.headers;

    if (!_id) {
        return res.status(400).json({status: 400, message: "Bad request - missing _id for user."});
    }

    try {
        await client.connect();
        const db = client.db("USERS");

        const user = await db.collection("users").findOne({_id : _id})

        !user ?
            res.status(404).json({status: 404, message: "User not found.", data: _id})
            : res.status(200).json({status: 200, message: "User Points retrieved successfully.", data: user.points});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "User Points not retrieved due to unknown server error. Please try again.", data: _id})
    }

    finally { 
        client.close();
    }
}

//get all userIds in the given user's circle (i.e. list of friends)
const getUserCircle = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);

    const { _id } = req.headers;

    if (!_id) {
        return res.status(400).json({status: 400, message: "Bad request - missing _id for user."});
    }

    try {
        await client.connect();
        const db = client.db("USERS");

        const user = await db.collection("users").findOne({_id : _id})

        !user ?
            res.status(404).json({status: 404, message: "User not found.", data: _id})
            : res.status(200).json({status: 200, message: "User Circle retrieved successfully.", data: user.circle});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "User Circle not retrieved due to unknown server error. Please try again.", data: _id})
    }

    finally { 
        client.close();
    }
}

//add a new user //CHANGE WHEN FIGURE OUT AUTH
//need password -- figure out how to set up an account!!
//have to check if username and email already exist
const addUser = async (req, res) => {
    
    const { username, name, email, avatar, tagline } = req.body;
    console.log("req body", req.body)

    //if no username and email are provided, we cannot add the user
    if (!username || !email) {
        return res.status(400).json({status: 400, message: "Username and email are required to create an account!", data: req.body})
    }
    
    const client = new MongoClient(MONGO_URI, options);
    
    try {
        await client.connect();
        
        console.log("connected");
        const db = client.db("USERS");
        
        //check if email already exists in user database
        const existingUser = await db.collection("users").findOne({email: email});
        
        if (existingUser) {
            return res.status(400).json({status: 400, message: "User already registered with this email.", data: req.body});
        }
        
        const usernameTaken = await db.collection("users").findOne({username: username});
        
        if (usernameTaken) {
            return res.status(400).json({status: 400, message: "Username not available.", data: req.body});
        }
        
        const _id = uuidv4();
        
        const newUser = {
            _id: _id,
            username: username,
            name: name, 
            email: email, 
            avatar: avatar, 
            tagline: tagline, 
            tangents: [],
            points: [],
            circle: []
        }
    
        console.log("newuser", newUser);

        const result = await db.collection("users").insertOne(newUser);

        console.log("result", result);

        (result.acknowledged) ?
            res.status(200).json({status: 200, message: "User added successfully.", data: result.insertedId})
            : res.status(500).json({status: 500, message: "User not added due to server error. Please try again.", data: req.body});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "User not added due to unknown server error. Please try again.", data: req.body})
    }

    finally { 
        client.close();
    }
}

//add a Point to the given user's list of bookmarked Points
const bookmarkPoint = async (req, res) => {
    const { userId, pointId } = req.body;

    console.log("body", userId, pointId)

    if (!userId || !pointId) {
        return res.status(400).json({status: 400, message: "Bad request - user ID or Point ID missing."});
    }

    const client = new MongoClient(MONGO_URI, options);

    try {
        await client.connect();
        const db = client.db("USERS");

        const user = await db.collection("users").findOne({_id: userId});

        if (!user) {
            return res.status(404).json({status: 404, message: "User not found.", data: req.body});
        }

        //check if point exists in points database?? though front end would not allow this case

        const updatedPoints = [...user.points, pointId];
        const update = await db.collection("users").updateOne({_id: userId}, { $set:{ points: updatedPoints}});

        if (update.matchedCount !== 1) {
            return res.status(404).json({status: 404, message: "User not found.", data: req.body});
        }
        else if (update.modifiedCount !== 1) {
            return res.status(500).json({ status: 500, message: "Could not add Point to user bookmarks. Please try your request again.", data: req.body});
        }
        else {
            res.status(200).json({status: 200, message: "Point bookmarked added successfully for user.", data: req.body});
        }
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Point not bookmarked due to server error. Please try again.", data: req.body})
    }

    finally { 
        client.close();
    }
}

//remove a Point from the given user's bookmarked Points
const removeBookmarkedPoint = async (req, res) => {
    const { userId, pointId } = req.body;

    console.log("body", userId, pointId)

    if (!userId || !pointId) {
        return res.status(400).json({status: 400, message: "Bad request - user ID or Point ID missing."});
    }

    const client = new MongoClient(MONGO_URI, options);

    try {
        await client.connect();
        const db = client.db("USERS");

        const user = await db.collection("users").findOne({_id: userId});

        console.log("user", user)

        if (!user) {
            return res.status(404).json({status: 404, message: "User not found.", data: req.body});
        }

        const updatedPoints = user.points.filter((point) => point !== pointId);
        console.log("updatedPoints", updatedPoints);

        const update = await db.collection("users").updateOne({_id: userId}, { $set:{ points: updatedPoints}});
        console.log("update", update);
        
        if (update.matchedCount !== 1) {
            return res.status(404).json({status: 404, message: "User not found.", data: req.body});
        }
        else if (update.modifiedCount !== 1) {
            return res.status(500).json({ status: 500, message: "Could not remove Point from user bookmarks. Please try your request again.", data: req.body});
        }
        else {
            res.status(200).json({status: 200, message: "Point removed successfully from user bookmarks.", data: req.body});
        }
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Point not removed from user bookmarks due to server error. Please try again.", data: req.body})
    }

    finally { 
        client.close();
    }
}

//add a user to the given user's circle (i.e. add a friend)
const addUserToCircle = async (req, res) => {
    const { userId, friendId } = req.body;

    console.log("reqbody", req.body);

    if (!userId || !friendId) {
        return res.status(400).json({status: 400, message: "Bad request - user ID or potential friend ID missing."});
    }

    const client = new MongoClient(MONGO_URI, options);

    try {
        await client.connect();
        console.log("connected")
        const db = client.db("USERS");

        const user = await db.collection("users").findOne({_id: userId});

        if (!user) {
            return res.status(404).json({status: 404, message: "User not found.", data: req.body});
        }

        const updatedCircle = [...user.circle, friendId];

        console.log ("updatedCircle", updatedCircle);

        const update = await db.collection("users").updateOne({_id: userId} , { $set: {circle: updatedCircle} });

        console.log("update", update);

        if (update.matchedCount !== 1) {
            return res.status(404).json({status: 404, message: "User not found.", data: req.body});
        }
        else if (update.modifiedCount !== 1) {
            return res.status(500).json({ status: 500, message: "Could not friend to user Circle. Please try your request again.", data: req.body});
        }
        else {
            res.status(200).json({status: 200, message: "Friend added successfully to user Circle.", data: req.body});
        }
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Friend not added to user Circle due to unknown server error. Please try again.", data: req.body})
    }

    finally { 
        client.close();
    }
}

//remove a user from the given user's circle (i.e. unfriend)
const removeUserFromCircle = async (req, res) => {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
        return res.status(400).json({status: 400, message: "Bad request - user ID or friend ID missing."});
    }

    const client = new MongoClient(MONGO_URI, options);

    try {
        await client.connect();
        const db = client.db("USERS");

        const user = await db.collection("users").findOne({_id: userId});

        if (!user) {
            return res.status(404).json({status: 404, message: "User not found.", data: req.body});
        }

        const updatedCircle = user.points.filter((friend) => friend._id !== friendId);
        const update = await db.collection("users").updateOne({_id: userId} , { $set: {circle: updatedCircle} });

        if (update.matchedCount !== 1) {
            return res.status(404).json({status: 404, message: "User not found.", data: req.body});
        }
        else if (update.modifiedCount !== 1) {
            return res.status(500).json({ status: 500, message: "Could not remove friend from user Circle. Please try your request again.", data: req.body});
        }
        else {
            res.status(200).json({status: 200, message: "Friend removed successfully from user Circle.", data: req.body});
        }
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Friend not removed from user Circle due to server error. Please try again.", data: req.body})
    }

    finally { 
        client.close();
    }

}

module.exports = { getUser, getUserTangents, getUserPoints, getUserCircle, addUser, bookmarkPoint, removeBookmarkedPoint, addUserToCircle, removeUserFromCircle };