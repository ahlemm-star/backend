const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const Don = require("./Don");

const DonBackupSchema = new Schema({

  user: {
    type: String,
    required: false,
  },
  nom: {
    type: String,
    required: false,
  },
  prenom: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: false,
  },

  ville: {
    type: String,
    required: false,
  },
  adresse: {
    type: String,
    required: false,
  },
  tel: {
    type: Number,
    required: false,
  },
  Email: {
    type: String,
    required: false,
  },
  DetailDon: {
    type: String,
    required: false,
  },
  produitName: {
    type: String,
    required: false,
  },
  ImageProduct: {
    type: String,
    required: false,
  },
  decriptionProduit: {
    type: String,
    required: false,
  },
  etat: {
    type: String,
    required: false,
  },
  codepostal: {
    type: Number,
    required: false,
  },
  cin: {
    type: Number,
    required: false,
  },
  message: {
    type: String,
    required: false,
  },
  id_user: {
    type: String,
    required: false,
  },
  code_trustit: {
    type: String,
    required: false,
  },
  modele: {
    type: String,
    required: false,
  },
  IMEI_SERIAL: {
    type: String,
    required: false,
  },
  diagnostic: {
    type: String,
    required: false,
  }
  // [bon etat ,mavaise etat ]
});
module.exports = donBackup = mongoose.model("donBackup", DonBackupSchema);
