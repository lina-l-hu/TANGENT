"use strict";

const express = require("express");
const morgan = require("morgan");

//import handlers
const { getPointSuggestions } = require("./handlers/getPointSuggestions");
const { addPoint, getPoint, getMostPopularPoint } = require("./handlers/pointHandlers");
const { getTangent, getPointsInTangent, getMostPopularTangent, 
    getMostRecentTangents, addPostToTangent, addTangent} = require("./handlers/tangentHandlers");
const { getUser, getUserTangents, getUserPoints, getUserCircle, 
    addUser, addLikedPoint, removeUnlikedPoint, addUserToCircle, removeUserFromCircle} = require("./handlers/userHandlers");

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
    .get("/point-suggestions", getPointSuggestions)
    .get("points/:pointId", getPoint)
    .get("points/most-popular", getMostPopularPoint)
    .post("/add-point", addPoint)
    
    //tangent endpoints
    .get("/tangents/:tangentId", getTangent)
    .get("/tangents/:tangentId/points", getPointsInTangent)
    .get("/tangents/most-popular-tangent", getMostPopularTangent)
    .get("/tangents/most-recent-tangents", getMostRecentTangents)
    .post("/tangents/:tangentId/add-post", addPostToTangent)
    .post("/tangents/add-tangent", addTangent)

    //user endpoints
    .get("/users/:userId", getUser)
    .get("/users/:userId/tangents", getUserTangents)
    .get("/users/:userId/points", getUserPoints)
    .get("/users/:userId/myCircle", getUserCircle)
    .patch("/users/:userId/like-point", addLikedPoint)
    .patch("/users/:userId/unlike-point", removeUnlikedPoint)
    .patch("/users/:userId/add-user-to-circle", addUserToCircle)
    .patch("/users/:userId/remove-user-from-circle", removeUserFromCircle)
    .post("/users", addUser)

    //catch all endpoint
    .get("*", (req, res) => {
        res.status(404).json({
        status: 404,
        message: "We couldn't find what you were looking for.",
        });
    })

    .listen(PORT, () => console.info(`Listening on port ${PORT}`));