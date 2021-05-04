const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const Coordinateur2Schema = new Schema({
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
    },
    contentType: {
        type: String,
        required: false
    }
});
module.exports = Sponsoring = mongoose.model("Coordinateur2", Coordinateur2Schema);