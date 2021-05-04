const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MailSchema = new Schema({

  nom: {
    type: String,
    required: false,
  },
  Email: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  }
});
module.exports = Don = mongoose.model("Mail", MailSchema);
