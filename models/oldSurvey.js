var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SurveySchema = new Schema({
  owner: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  active: {
      type: Boolean,
      default: true
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: "Question"
  }],
  responses: [{
    type: Schema.Types.ObjectId,
    ref: "Response"
  }]
});

var Survey = mongoose.model("Survey", SurveySchema);
module.exports = Survey;
