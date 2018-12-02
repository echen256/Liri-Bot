require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var moment = require("moment");
var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});

query(process.argv)


function queryConcert (args){
    if (args.length < 4){
        args.push("");
    }
    var url = "https://rest.bandsintown.com/artists/" + combineMultipleArgs(args) + "/events?app_id=codingbootcamp";
    axios.get(url).then(function (response) {
        var data = response.data[0];
        console.log(data.venue.name);
        console.log(data.venue.country + " " +data.venue.city );
        var date = data.datetime;
        console.log( moment(date,"YYYY-MM-DD[T]HH:mm:ss").format("MM/DD/YYYY"));
    }).catch(function (error) {
        console.log("*********************************");
        console.log(error);
    }); 
}

function querySpotify (args){
    if (args.length < 4){
        args.push("The Sign");
    }
    spotify.search({
        type : "track",
        query : combineMultipleArgs(args)
    },function (err, data){
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            var list =  data.tracks.items;
            var first = list[0];

            for (var i = 0; i < first.artists.length;i++){
                console.log(first.artists[i].name)
            }
            console.log(first.name);
            console.log(first.album.name);
            console.log(first.preview_url);
        }
    });
}



function queryMovie(args){
    if (args.length < 4) {
        args.push("Mr. Nobody")
    }
    url = "http://www.omdbapi.com/?apikey=trilogy&t=" + combineMultipleArgs(args);

    axios.get(url).then(function (response) {
        var data = response.data;
        console.log(data.Title);
        console.log(data.Year);
        console.log(data.Rated);
        console.log(data.Ratings[1].Value);
        console.log(data.Country);
        console.log(data.Language);
        console.log(data.Plot);
        console.log(data.Actors);
    }).catch(function (error) {
        console.log("*********************************");
        console.log(error);
    }); 
}

function combineMultipleArgs (args){
    var string = "";
    for (var i = 3; i < args.length - 1;i++){
        string += args[i] + "+";
    }
    string += args[args.length -1];
    return string;
}

function query(args){
    var type = args[2];
    switch (type) {
        case `concert-this`:
            queryConcert(args);
            break;

        case `spotify-this-song`:
           querySpotify(args);
            break;

        case `movie-this`:
            queryMovie(args);
            break;
            
        case `do-what-it-says`:
            var data = fs.readFile("random.txt", "utf8", function (error,data){
                data = data.split(",");
                var args = [0,0,data[0],data[1]];
                query(args);
            });
            break;
            
    
    }
    
}