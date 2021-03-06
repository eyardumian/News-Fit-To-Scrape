// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var request = require("request");

// Require all models
// var Note = require("./models/Note.js");
// var Article = require("./models/Article.js");
var db = require("./models");


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
// var db = mongoose.connection;
mongoose.connect("mongodb://localhost/newsScraper", {
// mongoose.connect("https://news-scrape-07.herokuapp.com/", {

  useMongoClient: true
});

// Routes

// Get route for scraping all the news
app.get("/scrape", function(req, res) {
  // Grab the html body
  axios.get("https://www.ocregister.com").then(function(response) {
  // request("http://www.ocregister.com", function(error, response, html) {

    // Save the html to $
    var $ = cheerio.load(response);
    // Grab every <p> with a class of title
    // $("h3.cd__headline").each(function(i, element) {
    $("h5.entry-title").each(function(i, element) {

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
          //res.send("Scrape Complete");
        })
        .catch(function(err) {
          res.json(err);
        });
    });
  });
  res.redirect("/");
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  console.log("fired from server");
  db.Article.find({})
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Route for grabbing a specific Article by id, populate it with it's Note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
  .populate("note")
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

//Route for saving an Article's note
app.post("/articles/:id", function(req, res) {
  db.Note
    .create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id}, { new: true });
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
    });


// Route for deleting an Article

app.delete("/delete/:id", function (req, res) {
//   db.Article.deleteOne({"_id": req.params.id});
// }).catch(function(err) {
//   res.json(err);
// });
db.notes.remove({
  "_id": mongojs.ObjectID(req.params.id)
}, function(error, removed) {
  if (error) {
    console.log(error);
    res.send(error);
   }
   else {
     console.log(removed);
     res.send(removed);
   }
 });
});


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
