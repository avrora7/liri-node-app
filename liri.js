require("dotenv").config();
var Spotify = require('node-spotify-api');

let keys = require("./keys");

var nodeArgs = process.argv;

// Validate input parameters
if (nodeArgs.length < 3 || nodeArgs.length > 4) {
    console.log("Invalid parameters");
    return;
}

var concert = "concert-this";
var song = "spotify-this-song";
var movie = "movie-this";

if (nodeArgs[2] !== concert && nodeArgs[2] !== song && nodeArgs[2] !== movie) {
    console.log("Enter valid command")
    return
}



var searchConcert = function (searchCriteria) {
    console.log(searchCriteria)
}

var searchSong = function (searchCriteria) {

    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    spotify.search({ type: 'track', query: searchCriteria }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
      //  console.log(data)
      var allSongs = data.tracks.items;
      
        allSongs.forEach(nextSong => {
          console.log(nextSong.name)
          console.log(nextSong.artists[0].name) 
          console.log(nextSong.album.name)
          console.log(nextSong.href)
          console.log('----------------********************----------------')
        })
      });



}





















var searchMovie = function (searchCriteria) {
    console.log(searchCriteria)
}



if (nodeArgs[2] == concert) {
    if (nodeArgs[3] == null) {
        nodeArgs[3] = ""
    }
    searchConcert(nodeArgs[3])
}
else if (nodeArgs[2] == song) {
    if (nodeArgs[3] == null) {
        nodeArgs[3] = "The Sign"
    }
    searchSong(nodeArgs[3])
}
else {
    if (nodeArgs[3] == null) {
        nodeArgs[3] = "Mr. Nobody"
    }
    searchMovie(nodeArgs[3])
}




