var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  text: {
    type: String,
    required: true
  }, 
  order: {
    type: Number,
    required: true
  },
  questionType: {
    type: String,
    required: true
  }, 
  answers: [{
    type: String
  }]
});

var Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
