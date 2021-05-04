const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const MatchingSchema = new Schema({
  idDon: {
    type: String,
    required: false,
  },
  idProfit: {
    type: String,
    required: false,
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
module.exports = Matching = mongoose.model("Matching", MatchingSchema);
