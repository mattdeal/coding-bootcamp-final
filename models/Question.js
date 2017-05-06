var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  text: {
    type: String,
    required: true
  }, 
  order: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    required: true
  }, 
  answers: [{
    type: String,
    required: false
  }]
});

var Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
