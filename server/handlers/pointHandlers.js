const { v4: uuidv4 } = require("uuid");

const { MongoClient, Db } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = { 
    useNewURLParser: true,
    useUnifiedTopology: true
}

const getPoint = async (req, res) => {

}

const addPoint = async (req, res) => {

    const { _id, title, type, coverImgSrc, year, by, country } = req.body;

    
   

}

//in user's circle
const getMostPopularPoint = async (req, res) => {

}

module.exports = { addPoint, getPoint, getMostPopularPoint };