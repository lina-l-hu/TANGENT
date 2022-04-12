const getTangent = () => {

}

const getPointsInTangent = () => {
    //get list of points in tangent if we have it? 
    //or search through entire tangent and gather pointIds, then map over them and find them all in the Points database/collection
}

const getMostPopularTangent = () => {
    //get all of a user's tangents and sort them by length
    //return that one or fetch anew??
}

//first post has most recent timestamp and one of the user's is a friend
//get last N documents in database
const getMostRecentTangents = () => {

}

const addPostToTangent = () => {
    //if user is not already in array of users for this tangent, add them
    //patch length of thread

    //if adding point
    //add tangentId to point object
    //add pointId to list of points in tangent
}

const addTangent = () => {

}

module.exports = { getTangent, getPointsInTangent, getMostPopularTangent, 
    getMostRecentTangents, addPostToTangent, addTangent};