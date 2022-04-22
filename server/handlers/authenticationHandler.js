const { MongoClient, Db } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = { 
    useNewURLParser: true,
    useUnifiedTopology: true
}

const authenticateUser = async (req, res) => {
    const { email, password } = req.body;

    const client = new MongoClient(MONGO_URI, options);

    if (!password && !email) {
        return res.status(400).json({status: 400, message: "Please enter your email and password to login.", data: {email: email}});
    }

    try {
        await client.connect();
        const db = client.db("USERS");
    
        const user = await db.collection("users").findOne({email : email});

        if (!user) {
            return res.status(404).json({status: 404, message: "User email not found. Would you like to sign up?", data: {email: email}});
        }
        
        if (user.password === password) {
            res.send({token: 'tangent123'});
        }
        
        else {
            res.status(500).json({status: 500, message: "Login failed due to server error. Please try again.", data: {email: email}})
        }       
    }

    catch (err) {
        res.status(500).json({status: 500, message: "Login failed due to server error. Please try again.", data: {email: email}})
    }

    finally {
        client.close();
    }
    
}

module.exports = { authenticateUser };