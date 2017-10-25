// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("/.models");

// Specify port number
var PORT = 3000;

// Initialize express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/newsSraper", {
  useMongoClient: true
});

// Routes

// Get rout for scraping all the news
app.get("/scrape", function(req, res) {
  // Grab the html body
  axios.get("https://www.reddit.com/").then(function(response) {
    // Save the html to $
    var $ = cheerio.load(response.data);
    // Grab every <p> with a class of title
    $("p.title").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of each link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new article using the result object
      db.Article
        .create(result)
        .then(function(dbArticle) {
          // Send a message to client upon successful scraping
          res.send("Scrape Complete");
        })
        .catch(function(err) {
          res.json(err);
        });
    });
  });
});

// Route for getting all Articles from the db

// Route for grabbing a specific Article by id, 


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
