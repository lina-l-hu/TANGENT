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

    const { id, title, type, coverImgSrc, year, by, country, description, link, currentUserId, currentTangentId } = req.body;

    if (!id || !title || !type || !currentUserId || !currentTangentId) {
        return res.status(400).json({status: 400, message: "Incomplete information -- cannot create Point.", data: req.body});
    }

    //if point is a film, we will be getting values for the following from an API
    let newBy = null;
    let newCountry = null;
    let newDescription = null;
    let newLink = null;

    const pointsClient = new MongoClient(MONGO_URI, options);
    const tangentsClient = new MongoClient(MONGO_URI, options);
    const usersClient = new MongoClient(MONGO_URI, options);

    try {

        await pointsClient.connect();

        const pointsDb = pointsClient.db("POINTS");

        //first check if Point already exists in database -- 
        const existingPoint = await pointsDb.collection(type).findOne({_id: id});

        console.log("existing", existingPoint);
        
        //if so, update the tangents array of this Point
        if (existingPoint) {
            const updatedTangents = [...existingPoint.mentionedIn, currentTangentId];
            console.log("updatedTangents", updatedTangents);
            const pointUpdate = await pointsDb.collection(type).updateOne({_id: id}, {$set: {mentionedIn: updatedTangents}});
            console.log("pointupdate", pointUpdate);
            if (pointUpdate.matchedCount !== 1 || pointUpdate.modifiedCount !== 1) {
                return res.status(500).json({ status: 500, message: "Could not update Point due to server error. Please try your request again.", data: req.body});
            }
        }
        //else create a new Point
        else {
            //if point type is film, we have to pull more information from an API because the imdb title search doesn't provide
            //all the information we want. For this second request, we will pull from OMDB to limit our calls to the imdb API
            if (type === "film") {
                var options = {
                    uri: `http://www.omdbapi.com/?i=${id}&apikey=${REACT_APP_OMDB_KEY}`, 
                    headers: {
                    "Accept": "application/json"
                    }, 
                    json: true
                };
            
                const data = await request(options);
                console.log("api returned data", data.Director);
                
                //set values with data returned from this request
                if (data.Response) {
                    console.log("hi")
                    newBy = data.Director;
                    console.log("newby", newBy);
                    newCountry = data.Country;
                    newDescription = data.Plot;
                    //imdb link is always in this format
                    newLink = `https://www.imdb.com/title/${id}`;

                    console.log(newBy, newCountry, newDescription, newLink);
                }
                //if we cannot get this additional data, then do not create this Point
                else {
                    return res.status(404).json({status: 404, message: "Could get information from API to create Point.", data: req.body});
                }
            }
        
            //create new Point, adding the currentTangentId to its list of mentions
            const newPoint = {
                _id: id, 
                title: title, 
                type: type, 
                coverImgSrc: coverImgSrc,
                year: year, 
                by: (type === "film") ? newBy : by, 
                country: (type === "film") ? newCountry : country,
                description: (type === "film") ? newDescription : description,
                link: (type === "film") ? newLink : link, 
                mentionedIn: [currentTangentId]
            }

            console.log("newPoint", newPoint)
            const addPoint = await pointsDb.collection(type).insertOne(newPoint);
            console.log("addPoint", addPoint)
            //if Point is not added to the Points database
            if (!addPoint.acknowledged) {
                return res.status(500).json({status: 500, message: "Point not added due to server error. Please try again.", data: req.body});
            }
        }
        //after a new Point is successfully added to the database or the mentionedIn array of an existing Point is successfully updated,
        //we still need to add this new post to the Tangent (i.e. a new document in the current Tangent collection)
        await tangentsClient.connect();

        const tangentsDb = tangentsClient.db("TANGENTS");

        //get latest post in the tangent
        const latestPost = await tangentsDb.collection(currentTangentId).find().sort({_id:-1}).limit(1).toArray();
        console.log("latestpost", latestPost);

        //if the current user is not already in the usersInTangent array (i.e. this is their first post in this Tangent)
        //then add their id to this array, then update the tangents array for the user in the USERS database
        const updatedUsersInTangent = latestPost[0].usersInTangent;
        console.log("updatedusers to set", updatedUsersInTangent);
      
        if (!latestPost[0].usersInTangent.includes(currentUserId)) {
            console.log("hi")
            updatedUsersInTangent.push(currentUserId);
            console.log("updatedUsersTang", updatedUsersInTangent);
            
            //update user in USERS database
            await usersClient.connect();
            const usersDb = usersClient.db("USERS");


            const userTangents = await usersDb.collection("users").find({_id: currentUserId}, {tangents: 1}).toArray();
            console.log("userTangents", userTangents);

            const updatedTangents = [...userTangents, currentTangentId];
            const update = await usersDb.collection("users").updateOne({_id: currentUserId}, { $set: { tangents: updatedTangents}});
            console.log("updatedUserTangent result", update);
        }
        
        //add the new Point id to the tangentPoints array
        const updatedTangentPoints = [...latestPost[0].tangentPoints, id];
        console.log("updated points", updatedTangentPoints);
        
        //increment the tangentLength by 1
        const newTangentLength = Number(latestPost[0].tangentLength)+1;

        //we will be using the autogenerated mongodb ObjectId as _id for each post because 
        //we can sort with it to order the posts by time
        const newPost = {
            tangentName: latestPost[0].tangentName, 
            usersInTangent: updatedUsersInTangent, 
            tangentPoints: updatedTangentPoints, 
            tangentLength: newTangentLength, 
            userId: currentUserId, 
            timestamp: moment().format("YYYY-MM-DD HH:mm"), 
            pointId: id
        }

        console.log("newPOst", newPost);
        const result = await tangentsDb.collection(currentTangentId).insertOne(newPost);
        console.log("result of post add", result)
        if (!result) {
            return res.status(500).json({status: 500, message: "Point not added to Tangent due to server error. Please try again.", data: req.body})
        }
       
        res.status(200).json({status: 200, message: "Point added successfully to Tangent", data: result.insertedId});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Point not added to Tangent due to unknown server error. Please try again.", data: req.body})
    }

    finally {
        pointsClient.close();
        tangentsClient.close();
        usersClient.close();
    }
}

//add text post to Tangent
const addMessageToTangent = async (req, res) => {

    const { currentTangentId } = req.params;
    const { currentUserId, text } = req.body;

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

        const updatedUsersInTangent = latestPost[0].usersInTangent;
    
        if (!latestPost[0].usersInTangent.includes(currentUserId)) {
            updatedUsersInTangent.push(currentUserId);
            
            //update user in USERS database
            await usersClient.connect();
            const usersDb = usersClient.db("USERS");

            const userTangents = await usersDb.collection("users").find({_id: currentUserId}, {tangents: 1}).toArray();
            
            const updatedTangents = [...userTangents, currentTangentId];
            const update = await usersDb.collection("users").updateOne({_id: currentUserId}, { $set: { tangents: updatedTangents}});
        }
        
        //increment the tangentLength by 1
        const newTangentLength = Number(latestPost[0].tangentLength)+1;

        //we will be using the autogenerated mongodb ObjectId as _id for each post because 
        //we can sort with it to order the posts by time
        const newPost = {
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
       
        res.status(200).json({status: 200, message: "Post added successfully to Tangent", data: result.insertedId})

    }

    catch {
        res.status(500).json({status: 500, message: "Post not added to Tangent due to unknown server error. Please try again.", data: req.body})
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
        
        console.log("connected");
        const tangentsDb = tangentsClient.db("TANGENTS");
        
        //generate random Tangent id 
        const tangentId = uuidv4();

        //first post of new Tangent
        const newPost = {
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

        console.log("result", result);
        
        //if Tangent is not added successfully
        if (!result.acknowledged) {
            return res.status(500).json({status: 500, message: "Tangent not added due to server error. Please try again.", data: req.body});
        }

        //if Tangent is added successfully, add tangent to tangents array for the current user
        await usersClient.connect();

        const usersDb = usersClient.db("USERS");

        //get tangents array for the current user
        const user = await usersDb.collection("users").findOne({_id: currentUserId});
        console.log("user", user)

        const updatedTangents = [...user.tangents, tangentId];
        console.log("updatedTang", updatedTangents)

        const updatedResult = await usersDb.collection("users").updateOne({_id: currentUserId}, { $set: {tangents: updatedTangents}});

        console.log("updatedRestul", updatedResult);
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