"use strict";

const express = require("express");
const morgan = require("morgan");

//import handlers
const { getPointSuggestions } = require("./handlers/getPointSuggestions");
const { getPoint, getMostPopularPoint } = require("./handlers/pointHandlers");
const { getTangent, getPointsInTangent, getMostPopularTangent, 
    getMostRecentTangents, getLatestPosts } = require("./handlers/tangentHandlers");
const { getUser, getUserTangents, getUserPoints, getUserCircle, 
    addUser, bookmarkPoint, removeBookmarkedPoint, addUserToCircle, removeUserFromCircle} = require("./handlers/userHandlers");
const { addPointToTangent, addMessageToTangent, addTangent } = require("./handlers/postToTangentHandlers");

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

    //point endpoints
    .get("/point-suggestions", getPointSuggestions)//T
    .get("/points/:pointId", getPoint)
    .get("/points/most-popular", getMostPopularPoint)//WT
    
    //tangent endpoints
    .get("/tangents/most-popular-tangent", getMostPopularTangent)//WT
    .get("/tangents/most-recent-tangents", getMostRecentTangents)//WT
    .get("/tangents/latest-posts", getLatestPosts)
    .get("/tangents/:tangentId", getTangent)
    .post("/tangents/add-tangent", addTangent) //RT for tangentId added in post object
    .get("/tangent/points", getPointsInTangent)
    .post("/tangent/add-point", addPointToTangent) //RT for tangentId added in post object
    .post("/tangent/add-message", addMessageToTangent) //RT for tangentId added in post object

    //user endpoints
    .get("/users/get-user", getUser)
    .get("/users/get-user-tangents", getUserTangents)
    .get("/users/get-user-points", getUserPoints)
    .get("/users/get-user-circle", getUserCircle)
    .patch("/users/bookmark-point", bookmarkPoint) 
    .patch("/users/remove-bookmarked-point", removeBookmarkedPoint)
    .patch("/users/add-user-to-circle", addUserToCircle)
    .patch("/users/remove-user-from-circle", removeUserFromCircle)
    .post("/users/add-user", addUser)

    //catch all endpoint
    .get("*", (req, res) => {
        res.status(404).json({
        status: 404,
        message: "We couldn't find what you were looking for.",
        });
    })

    .listen(PORT, () => console.info(`Listening on port ${PORT}`));