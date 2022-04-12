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
        return res.status(400).json({status: 400, message: "Bad request - missing _id for user."});
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

    if (!_id) {
        return res.status(400).json({status: 400, message: "Bad request - missing _id for user."});
    }

    try {
        await client.connect();
        const db = client.db("USERS");

        const user = await db.collection("users").findOne({_id : _id})

        !user ?
            res.status(404).json({status: 404, message: "User not found.", data: _id})
            : res.status(200).json({status: 200, message: "User Tangents retrieved successfully.", data: user.tangents});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "User Tangents not retrieved due to unknown server error. Please try again.", data: _id})
    }

    finally { 
        client.close();
    }
}

//get all the Points the given user has liked/saved
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

//add a new user
const addUser = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
}

//add a Point to the given user's list of Points liked
const addLikedPoint = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);

}

//remove a Point from the given user's list of Points liked (i.e. unlike a Point)
const removeUnlikedPoint = async (req, res) => {

}

//add a user to the given user's circle (i.e. add a friend)
const addUserToCircle = async (req, res) => {

}

//remove a user from the given user's circle (i.e. unfriend)
const removeUserFromCircle = async (req, res) => {

}

module.exports = { getUser, getUserTangents, getUserPoints, getUserCircle, addUser, addLikedPoint, removeUnlikedPoint, addUserToCircle, removeUserFromCircle };