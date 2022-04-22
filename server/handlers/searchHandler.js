const { MongoClient, Db } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = { 
    useNewURLParser: true,
    useUnifiedTopology: true
}

const searchForPointsAndUsers = async (req, res) => {

    const searchTerm = req.query.searchTerm;

    const pointsClient = new MongoClient(MONGO_URI, options);
    const usersClient = new MongoClient(MONGO_URI, options);
 
    try {
        //search point database for matches
        await pointsClient.connect();
        const pointsDb = pointsClient.db("POINTS");

        let pointMatches = { film: [], 
                             book: []
                          };

        //search each collection (type) for a match -- text index has been created for each type collection on mongoDB
        const query = { $text: { $search: `${searchTerm}` } };
        
        // Return the following fields for each matched Point
        const pointsProjection = {
          _id: 1,
          title: 1,
          type: 1, 
          by: 1,
          year: 1, 
          coverImgSrc: 1
        };

        //find Points based on our query and projection
        for (const key of Object.keys(pointMatches)) {
          pointMatches[key]= await pointsDb.collection(key).find(query).project(pointsProjection).toArray();
        }

        //search Users database for matches
        await usersClient.connect();
        const usersDb = usersClient.db("USERS");

        // Return the following fields for each matched User
        const usersProjection = {
          _id: 1,
          username: 1, 
          name: 1,
          imgSrc: 1, 
          tagline: 1
        };


        //find Users based on our query and projection
        const userMatches = await usersDb.collection("users").find(query).project(usersProjection).toArray();

        res.status(200).json({status: 200, message: "Matches returned.", data: {users: userMatches, points: [...pointMatches.film, ...pointMatches.book]}});
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Encountered server error during search -- please try again.", data: {searchTerm: searchTerm}});
    }

    finally {
        usersClient.close();
        pointsClient.close();
    }
}


module.exports = { searchForPointsAndUsers };