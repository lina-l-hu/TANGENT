const request = require('request-promise');
require("dotenv").config();
const { REACT_APP_IMDB_KEY, REACT_APP_OMDB_KEY, REACT_APP_GOOGLE_KEY } = process.env;

//get film suggestions for the searchTerm from the IMDB API
const getFilmsFromAPI = async (searchTerm) => {

  try {
    var options = {
      // uri: `http://www.omdbapi.com/?i=tt3896198&apikey=${REACT_APP_OMDB_KEY}`, 
      uri: `https://imdb-api.com/en/API/SearchMovie/${REACT_APP_IMDB_KEY}/${searchTerm}`,
      headers: {
        "Accept": "application/json"
      }, 
      json: true
    };

    const data = await request(options);
    console.log("api returned data", data);
    return data;
    // return data.value;
  }
  catch (err) {
    return err.message;
  }
}

//get book suggestions for the searchTerm from the IMDB API
const getBooksFromAPI = async (searchTerm) => {

  try {
    var options = {
      uri: `https://www.googleapis.com/books/v1/volumes?q=` + searchTerm + `&key=` + REACT_APP_GOOGLE_KEY + `&maxResults=5`,
      headers: {
        "Accept": "application/json"
      }, 
      json: true
    };

    const data = await request(options);
    console.log("api returned data", data);
    return data;
    // return data.value;
  }
  catch (err) {
    return err.message;
  }
}


const getPointSuggestions = async (req, res) => {

    const searchTerm = req.query.searchTerm;

    try {
    
        const filmSuggestions = await getFilmsFromAPI(searchTerm);
        const bookSuggestions = await getBooksFromAPI(searchTerm);

        if (!filmSuggestions && !bookSuggestions) {
            return res.status(404).json({status: 404, message: "No matches -- please try another search term.", data: searchTerm})
        }
        
        if (!filmSuggestions) {
            return res.status(200).json({status: 200, message: "Matches found!", 
                  data: {films: "No film matches found.", books: bookSuggestions.data} });
        }

        if (!filmSuggestions) {
          return res.status(200).json({status: 200, message: "Matches found!", 
                data: {films: filmSuggestions.results, books: "No book matches found."} });
       }

        res.status(200).json({status: 200, message: "Matches found!", data: {films: filmSuggestions.results, books: bookSuggestions.items} });
    }

    catch (err) {
        console.log("error in get point sugg", err)
        res.status(500).json({status: 500, message: "An unknown occurred during search. Please try again.", data: searchTerm})
    }


    //from each API, return the top 3 matches
    //results stored in state
    //user sees all results in a dropup or tippy
    //user chooses one
    //post to server the chosen's info + tangentID to make new point object in database, returns ID
    //in same handler, ID is added to tangent object array
    //tangent should rerender with this new point added as a pointPreview

}

module.exports = { getPointSuggestions };