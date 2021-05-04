const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UniversitySchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  value: {
    type: String,
    required: false,
  },
  email : {
    type: String,
    required : false
  }
  ,id_user:{
type:String,

  }
});
module.exports = University = mongoose.model("University", UniversitySchema);
