var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AnswerSchema = new Schema({
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question"
  },
  value : {
      type: String,
      required: true
  }
});

var Answer = mongoose.model("Answer", AnswerSchema);
module.exports = Answer;
