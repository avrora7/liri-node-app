require("dotenv").config();

var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment');

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

// Search concert and display results
var searchConcert = function (searchCriteria) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + encodeURI(searchCriteria) + "/events?app_id=codingbootcamp";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var result = JSON.parse(body)

            if (result.length === 0) {
                console.log("No concerts scheduled");
            }

            for (i = 0; i < result.length; i++) {
                var nextResult = result[i]
                console.log("Venue name: " + nextResult.venue.name);
                console.log("Venue location: " + nextResult.venue.city + " " + nextResult.venue.region + " " + nextResult.venue.country);

                var dateTime = nextResult.datetime;
                console.log("Event Date: " + moment(dateTime).format('MM/DD/YYYY'))
                console.log("")
            }
        }
        else {
            console.log(queryUrl)
        }
    });
}

// Search song and display results
var searchSong = function (searchCriteria) {

    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    spotify.search({ type: 'track', query: searchCriteria }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var allSongs = data.tracks.items;

        allSongs.forEach(nextSong => {
            console.log(nextSong.name)
            console.log(nextSong.artists[0].name)
            console.log(nextSong.album.name)
            console.log(nextSong.href)
            console.log('')
        })
    });
}

// Search movie and display results
var searchMovie = function (searchCriteria) {
    var queryUrl = "http://www.omdbapi.com/?t=" + encodeURI(searchCriteria) + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var result = JSON.parse(body)

            console.log("Movie title: " + result.Title);
            console.log("Release Year: " + result.Year);
            console.log("IMDB Rating: " + result.imdbRating);

            var ratings = result.Ratings;
            for (i = 0; i < ratings.length; i++) {
                var source = ratings[i].Source;
                if (source == 'Rotten Tomatoes') {
                    console.log("Rotten Tomatoes Rating: " + ratings[i].Value)
                }
            }
            console.log("Country: " + result.Country);
            console.log("Language: " + result.Language);
            console.log("Plot: " + result.Plot);
            console.log("Actors: " + result.Actors);
        }
    });
}

// Input parameter based command execution and default definition
if (nodeArgs[2] == concert) {
    if (nodeArgs[3] == null) {
        nodeArgs[3] = "Metallica"
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




