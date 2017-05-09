var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AnswerSchema = new Schema({
  question: {
    type: String,
    ref: "Question"
  },
  value : {
    type: String,
    required: true
  }
});

var Answer = mongoose.model("Answer", AnswerSchema);
module.exports = Answer;
