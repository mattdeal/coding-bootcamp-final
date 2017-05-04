var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ResponseSchema = new Schema({
  survey: {
    type: Schema.Types.ObjectId,
    ref: "Survey"
  },
  answers: {
    type: Schema.Types.ObjectId,
    ref: "Answer"
  }
  //todo: do we need a responseTime/creationTime?
});

var Response = mongoose.model("Response", ResponseSchema);
module.exports = Response;
