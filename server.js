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

// Require Schema
var Survey = require("./models/Survey");
var Answer = require("./models/Answer");
var Question = require("./models/Question");
var Response = require("./models/Response");

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

function validateAndRun(token, req, res, successCallback) {
  console.log('validating...');

  // var token = req.body.token;
  
  try {
    client.verifyIdToken(token, CLIENT_ID, function(e, login) {
      var payload = login.getPayload();
      var userId = payload['sub'];

      console.log('valid');

      successCallback(req, res, userId);
    });
  } catch (ex) {
    console.log('invalid');

    res.json({ errorMessage: 'You must be logged in to access this feature', error: ex.toString() });
  } 
}

// create a Survey owned by userId
function createSurvey(req, res, userId) {
  console.log('user validated with id' + userId);
  var survey = req.body.survey;
  survey.owner = userId;
  console.log(survey);

  var newSurvey = new Survey(survey);
  console.log(newSurvey);

  newSurvey.save(function(error, doc) {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      res.send(doc);
    }
  });

  // construct survey object for mongoose
  // var survey = {
  //   name: req.body.survey.name,
  //   questions: []
  // };

  // var questions = req.body.survey.questions;
  // for (var i = 0; i < questions.length; i++) {
  //   var question = {
  //     order: questions[i].order,
  //     text: questions[i].text,
  //     questionType: questions[i].questionType
  //   };
  // }

  // console.log(survey);

  // res.json({ working: true });
}

// get all Surveys owned by userId
function getSurveys(req, res, userId) {
  Survey.find({ owner: userId }).exec(function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      console.log(doc);
      res.send(doc);
    }
  });
}

// -------------------------------------------------

// Main "/" Route. This will redirect the user to our rendered React application
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// confirm that the user is signed into our app with their google account
app.post("/validate", function(req, res){
  var token = req.body.token;

  try {
    client.verifyIdToken(token, CLIENT_ID, function(e, login) {
      var payload = login.getPayload();
      var userId = payload['sub'];
      res.json({ userId: userId });
    });
  } catch (ex) {
    res.json({ errorMessage: 'You must be logged in to access this feature', error: ex.toString() });
  }  
});

// create a survey
app.post("/survey", function(req, res) {
  console.log('received POST to /survey');
  validateAndRun(req.body.token, req, res, createSurvey);
});

// create a response
app.post("/response", function(req, res) {
  //todo: create survey Response from req.body
});

// get all surveys owned by the current user
app.get("/surveys", function(req, res) {
  console.log('received GET to /surveys');
  validateAndRun(req.query.token, req, res, getSurveys);
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
