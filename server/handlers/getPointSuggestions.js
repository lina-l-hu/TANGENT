const request = require('request-promise');
const { MongoClient, Db } = require("mongodb");
require("dotenv").config();
const { REACT_APP_IMDB_KEY, REACT_APP_OMDB_KEY, REACT_APP_GOOGLE_KEY, MONGO_URI } = process.env;

const options = { 
  useNewURLParser: true,
  useUnifiedTopology: true
}

//limit number of possible matches from API to send to FE
const NUM_MATCHES = 3;

//helper function get film suggestions for the searchTerm from the IMDB API
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
    return data.results;
    // return data.value;
  }
  catch (err) {
    console.log("error fetching from imdb", err)
    return null;
  }
}


//helper function get details for a single film from the OMDB API
const getFilmFromOMDB = async (filmId) => {

  try {
    var options = {
      uri: `http://www.omdbapi.com/?i=${filmId}&apikey=${REACT_APP_OMDB_KEY}`, 
      headers: {
        "Accept": "application/json"
      }, 
      json: true
    };

    const data = await request(options);
    return data;
  }
  catch (err) {
    console.log("error fetching from omdb", err)
    return null;
  }
}

//helper function to get book suggestions for the searchTerm from the Google Books API
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
    return data.items;
    // return data.value;
  }
  catch (err) {
    console.log("error fetching from googlebooks", err)
    return null;
  }
}

//handler to get Point suggestions
const getPointSuggestions = async (req, res) => {

    const searchTerm = req.query.searchTerm;

    const client = new MongoClient(MONGO_URI, options);
 
    try {
        //search point database for matches
        await client.connect();
        const db = client.db("POINTS");

        let pointMatches = { film: [], 
                             book: []
                          };

        //search each collection (type) for a match -- text index has been created for each type collection on mongoDB
        const query = { $text: { $search: `${searchTerm}` } };
        
        // Return the following fields for each matched Point
        const projection = {
          _id: 1,
          title: 1,
          type: 1, 
          by: 1,
          year: 1
        };

        //find Points based on our query and projection
        for (const key of Object.keys(pointMatches)) {
          pointMatches[key]= await db.collection(key).find(query).project(projection).toArray();
        }

        // console.log("pointMatches", pointMatches);

        //search APIs for matches
        const filmSuggestions = await getFilmsFromAPI(searchTerm);
        const bookSuggestions = await getBooksFromAPI(searchTerm);
 
        // console.log("filmsug", filmSuggestions.length);
        // console.log("bookSuff", bookSuggestions.length);
        // console.log("bookSuggestions", bookSuggestions);

        if (pointMatches["book"].length === 0 && pointMatches["film"].length === 0 && !filmSuggestions && !bookSuggestions) {
            return res.status(404).json({status: 404, message: "No matches -- please try another search term.", data: searchTerm})
        }

        let formattedFilmSuggestions = [];
        let formattedBookSuggestions = [];

        if (filmSuggestions.length > 0) {

            //filter out any suggestions that are already in the Point suggestions
            let filteredFilmSuggestions = filmSuggestions;

            if (pointMatches["film"].length > 0) {
                filteredFilmSuggestions = filmSuggestions.filter((suggestion) => {
                    const notDuplicate = pointMatches["film"].every((film) => film._id !== suggestion.id);
                    if (notDuplicate) {
                        return suggestion;
                    }
                })
            }
            
            //we will return to the client only the top NUM_MATCHES (3) results
            let topFilmSuggestions = filteredFilmSuggestions.slice(0, NUM_MATCHES);
            // console.log("topFilmsugg", topFilmSuggestions);

            //since imdb doesn't provide us all the data we want, we have to request additional data
            //from the omdb for each of the 3 matches we are returning
            
            await Promise.all (
              topFilmSuggestions.map(async(suggestion) => {

                let omdbResult = await getFilmFromOMDB(suggestion.id);
                // console.log("omdb", omdbResult);

                const film = {
                    _id: suggestion.id,
                    title: suggestion.title,
                    type: "film", 
                    coverImgSrc: suggestion.image,
                    year: omdbResult.Year,
                    by: omdbResult.Director,
                    language: omdbResult.Language,
                    description: omdbResult.Plot,
                    link: `https://www.imdb.com/title/${suggestion.id}`,
                }

                // console.log("film b4 push", film);
                formattedFilmSuggestions.push(film);
            })
            )
            
            
            // topFilmSuggestions.forEach((suggestion) => {

            //     const film = {
            //         _id: suggestion.id,
            //         title: suggestion.title,
            //         type: "film", 
            //         coverImgSrc: suggestion.image,
            //         year: suggestion.description.slice(1, 5)
            //     }

            //     // console.log("film b4 push", film);
            //     formattedFilmSuggestions.push(film);
            // })
        }
        
      
        if (bookSuggestions.length > 0) {

            //filter out duplicates in the api suggestions by title and author (very common because of multiple editions, hardcover vs softcover etc)
            // //make an array of all the author, title pairs
            // //use set to get unique 
            // //filter original array to get only the entries that match this set
            // const titlesAndBys = bookSuggestions.map((book) => {
            //     // return {
            //     //     title: book.volumeInfo.title,
            //     //     by: book.volumeInfo.authors.toString()
            //     // }
            //     return [book.volumeInfo.title, book.volumeInfo.authors.toString()];
            // })
            // console.log("title and by", titlesAndBys);
            // const uniqueTitlesAndBys = [...new Set(titlesAndBys)];

            // console.log("unique title and by", uniqueTitlesAndBys);

            // const uniqueBookSuggestions = [];
            
            // uniqueTitlesAndBys.forEach((item) => {
            //     // const book = bookSuggestions.find((suggestion) => 
            //     //   suggestion.volumeInfo.title === item.title && suggestion.volumeInfo.authors.toString() === item.by);
            //       const book = bookSuggestions.find((suggestion) => 
            //       suggestion.volumeInfo.title === item[0] && suggestion.volumeInfo.authors.toString() === item[1]);
            //     uniqueBookSuggestions.push(book);
            // })

//             const uniqueBookSuggestions = [bookSuggestions[0]];

//             for (let i = 1; i < bookSuggestions.length; i++) {

//                 // const notDuplicate = uniqueBookSuggestions.every((book) => 
//                 // ;
//                 const duplicate = uniqueBookSuggestions.every((book) => {

// ((book.volumeInfo.title === bookSuggestions[i].volumeInfo.title) && (book.volumeInfo.authors.toString() === bookSuggestions[i].volumeInfo.authors.toString()))


//                 })
//                     //if author and title are different

//                     //if authors are the same, then the title is different

//                     //if title is the same, then the author is different
//                 // })



//                 // (book.volumeInfo.title !== bookSuggestions[i].volumeInfo.title))

//                 if (!duplicate) {
//                   uniqueBookSuggestions.push(bookSuggestions[i]);
//                 }
                
               
//             }

//             console.log("unique books", uniqueBookSuggestions);
           
            //filter out any suggestions that are already in the Point suggestions
            let filteredBookSuggestions = bookSuggestions;

            if (pointMatches["book"].length > 0) {
                filteredBookSuggestions = bookSuggestions.filter((suggestion) => {
                    const notDuplicate = pointMatches["book"].every((book) => book._id !== suggestion.volumeInfo.industryIdentifiers[0].identifier);
                    if (notDuplicate) {
                        return suggestion;
                    }
                })
            }
            
            // console.log("filteredBook", filteredBookSuggestions);
            //we will return to the client only the top NUM_MATCHES (3) results
            let topBookSuggestions = filteredBookSuggestions.slice(0, NUM_MATCHES);
  
            topBookSuggestions.forEach((suggestion) => {

                //format authors list
                const authors = suggestion.volumeInfo.authors.toString();
                let formattedAuthors = authors.replace(",", ", ");
                
                // console.log("_id:", suggestion.volumeInfo.industryIdentifiers[0].identifier);
                // console.log("title:", suggestion.volumeInfo.title);
                // console.log("coverImgSrc:", suggestion.volumeInfo.imageLinks.thumbnail)
                // console.log("year:", suggestion.volumeInfo.publishedDate.slice(0, 4))
                // console.log("by:", formattedAuthors)
                // console.log("language:", suggestion.volumeInfo.language)
                // console.log("description:", suggestion.volumeInfo.description)
                // console.log("link", suggestion.volumeInfo.infoLink)
                const book = {
                  _id: suggestion.volumeInfo.industryIdentifiers[0].identifier,
                  // _id: suggestion.id,
                  title: suggestion.volumeInfo.title,
                  type: "book", 
                  coverImgSrc: suggestion.volumeInfo.imageLinks.thumbnail,
                  year: suggestion.volumeInfo.publishedDate.slice(0, 4),
                  by: formattedAuthors,
                  language: suggestion.volumeInfo.language,
                  // description: suggestion.searchInfo.textSnippet,
                  description: suggestion.volumeInfo.description,
                  link: suggestion.volumeInfo.infoLink
                }
                // console.log("book b4 push", book)

                formattedBookSuggestions.push(book);
            })
          }
        

        // console.log("hi");
        // console.log("filmPOint", pointMatches["film"], "bookPoins", pointMatches["book"]);
        // console.log( "films", formattedFilmSuggestions)
        // console.log( "books", formattedBookSuggestions);

        //return API and point matches to front end to render
        res.status(200).json({status: 200, message: "Matches found!", 
        data: {filmPoints: pointMatches["film"],
              bookPoints: pointMatches["book"], 
              films: formattedFilmSuggestions, 
              books: formattedBookSuggestions
            } });
    }

    catch (err) {
        res.status(500).json({status: 500, message: "An unknown error occurred during search. Please try again.", data: searchTerm})
    }

}

module.exports = { getPointSuggestions };