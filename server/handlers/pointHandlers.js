const { v4: uuidv4 } = require("uuid");
const request = require('request-promise');
const { MongoClient, Db } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = { 
    useNewURLParser: true,
    useUnifiedTopology: true
}

//receives an array of pointIds
const getPointsByIds = async (req, res) => {
    
    const { pointids } = req.headers;
    
    if (!pointids) {
        return res.status(400).json({status: 400, message: "Bad request - no Point id provided."});
    }
    
    //array sent as a string in the header, so convert it back to an array
    let idArray = [];
    if (pointids.indexOf(",") === -1) {
        idArray = [pointids];
    }
    else {
        idArray = pointids.split(",");
    }

    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("POINTS");

        const pointsToReturn = [];
        
        await Promise.all (
            idArray.map( async (id) => {
                let type = null;
                type = (id.charAt(0) === "t") ? "film" : "book";
                let point = await db.collection(type).findOne({_id : id});
                pointsToReturn.push(point);
            })
        )
        
        console.log("point(s) retrieved", pointsToReturn);
        
        (!pointsToReturn) ?
            res.status(404).json({status: 404, message: "Point(s) not found.", data: pointids})
            : res.status(200).json({status: 200, message: "Point(s) retrieved successfully.", data: pointsToReturn});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Point not retrieved due to unknown server error. Please try again.", data: pointids})
    }

    finally {
        client.close();
    }
}

//get most popular Point in the given user's Circle, i.e. mentioned in the most Tangents
const getMostPopularPoint = async (req, res) => {
    //current user id
    const { _id } = req.headers;

    const usersClient = new MongoClient(MONGO_URI, options);
    const pointsClient = new MongoClient(MONGO_URI, options);

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
        
        const allPointIdsInCircle = []; 
        await Promise.all (
            //for each of the users in the Circle, get their lastPosts array
            circleIds.map( async (id) => {
                const friend = await usersDb.collection("users").findOne({_id : id});

                if (friend) {
                    const friendLastPosts = friend.lastPosts;
                    
                    //for each of the lastPosts, get the tangentPoints array and merge into one 
                    //array for all users in the Circle
                    friendLastPosts.forEach((post) => {
                        allPointIdsInCircle.push(...post.tangentPoints);
                    })
                }
                
            })
        )

        //merge the current user's points into the array as well
        user.lastPosts.forEach((post) => {
            allPointIdsInCircle.push(...post.tangentPoints);
        })
        
        //get an array of all the unique Points in the user's circle
        let uniquePointsIdsInCircle = [...new Set(allPointIdsInCircle)];

        //for each pointId, fetch point from the points database and add to an array
        await pointsClient.connect();
        const pointsDb = pointsClient.db("POINTS");

        const allPointObjectsInCircle = [];
        await Promise.all (
            uniquePointsIdsInCircle.map( async (id) => {
                let type = (id.charAt(0) === "t") ? "film" : "book";
                const point = await pointsDb.collection(type).findOne({_id : id});
                allPointObjectsInCircle.push(point);
            })
        )
        

        //sort Points by the length of the mentionedIn array
        let sorted  = allPointObjectsInCircle.sort((a, b) => {
            return b.mentionedIn.length - a.mentionedIn.length;
        })

        console.log("point to return", sorted[0]);

        //return the post with greatest tangentLength
        (sorted.length > 0) ? 
            res.status(200).json({status: 200, message: "Successfully retrieved most popular Point.", data: sorted[0]})
            : res.status(404).json({status: 404, message: "Could not get the most popular Point.", data: _id});
    }

    catch (err) {
        res.status(500).json({status: 500, message: `Most popular Point not retrieved due to unknown server error: ${err}. Please try again.`, data: _id})
    }

    finally {
        usersClient.close();
        pointsClient.close();
    }
}

module.exports = { getPointsByIds, getMostPopularPoint };