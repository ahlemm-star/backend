const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const DonArgentSchema = new Schema({
    nom: {
        type: String,
        required: false
    },
    file: {
        type: String,
        required: false
    },
    prenom: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    raisonsociale: {
        type: String,
        required: false
    },
    identifiant: {
        type: String,
        required: false
    },
    adresse: {
        type: String,
        required: false
    },
    codepostal: {
        type: Number,
        required: false
    },
    commune: {
        type: String,
        required: false
    },
    montant: {
        type: Number,
        required: false
    },
    montantlettre: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
});
module.exports = DonArgent = mongoose.model("DonArgent", DonArgentSchema);