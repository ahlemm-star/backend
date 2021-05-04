const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const MatchingSchema = new Schema({
  idDon: {
    type: Schema.Types.ObjectId,
     ref: 'Don'
  },
  idProfit: {
    type: Schema.Types.ObjectId, 
    ref: 'profits'
  },
  etat: {
    type: String,
    required: false,
  },
  code_logistique: {
    type: String,
    required: false,
  },
});
module.exports = Matching = mongoose.model("Matches", MatchingSchema);
