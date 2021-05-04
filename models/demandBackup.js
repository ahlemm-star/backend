const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const Profit = require("./Profit");

const ProfitBackupSchema = new Schema({

  user: {
    type: String,
    required: false,
  }, nom: {
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
  codepostal: {
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
  cin: {
    type: Number,
    required: false,
  },
  Email: {
    type: String,
    required: false,
  },

  nom_universite: {
    type: String,
    required: false,
  },
  niveau_scolarite: {
    type: String,
    required: false,
  },
  specialite: {
    type: String,
    required: false,
  },
  etablissement: {
    type: String,
    required: false,
  },
  besoin: {
    type: String,
    required: false,
  },
  detail: {
    type: String,
    required: false,
  },
  id_user: {
    type: String,
    required: false,
  }
  // [bon etat ,mavaise etat ]
});
module.exports = ProfitBackup = mongoose.model("ProfitBackup", ProfitBackupSchema);
