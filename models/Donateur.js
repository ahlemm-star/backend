const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const  DonateurSchema = new Schema({
    nom: {
        type: String,
        required: false
    },
    image: {
        type: String, 
        required: false
    },
    website: {
        type: String,
        required: false
    }
});
module.exports = Donateur = mongoose.model("Donateur", DonateurSchema);