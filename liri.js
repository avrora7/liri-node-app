require("dotenv").config();

var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment');
var fs = require('fs');
var keys = require("./keys");

var nodeArgs = process.argv;

// Validate input parameters
if (nodeArgs.length < 3 || nodeArgs.length > 4) {
    console.log("Invalid parameters");
    return;
}

var concert = "concert-this";
var song = "spotify-this-song";
var movie = "movie-this";
var whatSays = "do-what-it-says";

var cmd = nodeArgs[2];
var srch = nodeArgs[3];

if (cmd !== concert && cmd !== song && cmd !== movie && cmd !== whatSays) {
    console.log("Enter valid command");
    return;
}

// do-what-it-says
if (cmd == whatSays) {
    var content = fs.readFileSync('random.txt', 'utf8');

    var index = content.indexOf(",");
    var newCommand = content.substring(0, index).trim();
    var newValue = content.substring(index + 1).trim();

    cmd = newCommand;

    if (newValue.startsWith('"') && newValue.endsWith('"') || newValue.startsWith("'") && newValue.endsWith("'")) {
        newValue = newValue.substring(1, newValue.length - 1)
    }
    srch = newValue;
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

            console.log("Movie Title: " + result.Title);
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
if (cmd == concert) {
    if (srch == null) {
        srch = "Metallica"
    }
    searchConcert(srch)
}
else if (cmd == song) {
    if (srch == null) {
        srch = "The Sign"
    }
    searchSong(srch)
}
else {
    if (srch == null) {
        srch = "Mr. Nobody"
    }
    searchMovie(srch)
}




