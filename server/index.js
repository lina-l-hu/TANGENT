"use strict";

const express = require("express");
const morgan = require("morgan");
const cors = require('cors');


//import handlers
const { getPointSuggestions } = require("./handlers/getPointSuggestions");
const { getPointsByIds, getMostPopularPoint } = require("./handlers/pointHandlers");
const { getTangent, getPointsInTangent, getMostPopularTangent, 
    getMostRecentTangents, getLatestPosts, getUsersInTangent } = require("./handlers/tangentHandlers");
const { getUser, getMultipleUsers, getUserTangents, getUserPoints, getUserCircle, 
    addUser, bookmarkPoint, removeBookmarkedPoint, addUserToCircle, removeUserFromCircle} = require("./handlers/userHandlers");
const { addPointToTangent, addMessageToTangent, addTangent } = require("./handlers/postToTangentHandlers");
const { authenticateUser } = require("./handlers/authenticationHandler");
const { searchForPointsAndUsers } = require("./handlers/searchHandler");

//server port
const PORT = 8000;

express()
    .use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
        );
        next();
    })
    .use(morgan("tiny"))
    .use(express.json())
    .use(express.static("public"))
    .use(cors())
    .use('/login', authenticateUser)

    //point endpoints
    .get("/point-suggestions", getPointSuggestions)
    .get("/points/most-popular", getMostPopularPoint)
    .get("/points", getPointsByIds)
    
    //tangent endpoints
    .get("/tangents/most-popular-tangent", getMostPopularTangent)
    .get("/tangents/most-recent-tangents", getMostRecentTangents)
    .get("/tangents/latest-posts", getLatestPosts)
    .get("/tangents/:tangentId", getTangent)
    .get("/tangent/points", getPointsInTangent) 
    .get("/tangent/users", getUsersInTangent)
    .post("/tangents/add-tangent", addTangent)
    .post("/tangent/add-point", addPointToTangent) 
    .post("/tangent/add-message", addMessageToTangent) 

    //user endpoints
    .get("/users/get-user", getUser)
    .get("/users/get-users", getMultipleUsers)
    .get("/users/get-user-tangents", getUserTangents)
    .get("/users/get-user-points", getUserPoints)
    .get("/users/get-user-circle", getUserCircle) 
    .patch("/users/bookmark-point", bookmarkPoint) 
    .patch("/users/remove-bookmarked-point", removeBookmarkedPoint)
    .patch("/users/add-user-to-circle", addUserToCircle)
    .patch("/users/remove-user-from-circle", removeUserFromCircle)
    .post("/users/add-user", addUser)

    //search users and points endpoint
    .get ("/search", searchForPointsAndUsers)
    //catch all endpoint
    .get("*", (req, res) => {
        res.status(404).json({
        status: 404,
        message: "We couldn't find what you were looking for.",
        });
    })

    .listen(PORT, () => console.info(`Listening on port ${PORT}`));