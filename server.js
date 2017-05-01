// Include Server Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var GoogleAuth = require('google-auth-library');

// setup google auth
var auth = new GoogleAuth;
var CLIENT_ID = '522503509161-6nqe2itj8jpdje5uoa0ep6c99odreb8q.apps.googleusercontent.com';
var client = new auth.OAuth2(CLIENT_ID, '', '');

// Require History Schema
// var History = require("./models/History");

// Create Instance of Express
var app = express();
// Sets an initial port. We'll use this later in our listener
var PORT = process.env.PORT || 8080;

// Run Morgan for Logging
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("./public"));

// -------------------------------------------------

// mongoose.connect("mongodb://admin:codingrocks@ds023664.mlab.com:23664/reactlocate");
mongoose.connect("mongodb://localhost/survey");
var db = mongoose.connection;

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// -------------------------------------------------

// Main "/" Route. This will redirect the user to our rendered React application
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// confirm that the user is signed into our app with their google account
app.post("/validate", function(req, res){
  var token = req.body.token;
  client.verifyIdToken(token, CLIENT_ID, function(e, login) {
    var payload = login.getPayload();
    var userId = payload['sub'];
    res.json({ userId: userId });
  });
});

// create a survey
app.post("/survey", function(req, res) {
  //todo: validate req.body.token
  //todo: store userid
  //todo: create survey in db with userid as owner
});

// create a response
app.post("/response", function(req, res) {
  //todo: create surveyResponse from req.body
});

// get all surveys owned by the current user
app.get("/surveys", function(req, res) {
  //todo: validate req.body.token
  //todo: store userid
  //todo: get all surveys where userid is the owner
});

// get a single survey
app.get("/survey/:id", function(req, res) {
  //todo: get a single survey
});

// get the results for a single survey owned by the current user
app.get("/results/:id", function(req, res){
  //todo: validate req.body.token
  //todo: store userid
  //todo: get all results for this surveyId
});

// -------------------------------------------------

// Listener
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
