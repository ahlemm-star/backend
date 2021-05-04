const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
var fs = require('fs');
const DonArgent = require("../../models/donArgent");
const path = require('path');
const slash = require('slash');
const multer = require('multer');
var FTPStorage = require('multer-ftp')
/* String.prototype.replaceAll = function (target, replacement) {
  return this.split(target).join(replacement);
}; */
const FTP = require('ftp');
const ftpClient = new FTP();
const ftp = {
  host: 'ftp.sharek-it.tn',
  user: 'sharek',
  password: 'GEfs23tQ6'
}

const storage = new FTPStorage({
  ftp: {
    host: 'ftp.sharek-it.tn',
    user: 'sharek',
    password: 'GEfs23tQ6',
    keepalive: 9999999
  },
  connection: ftpClient,
  basepath: '/public_html/assets/img/donArgent/',
  destination: function (req, file, options, callback) {
    ftpClient.connect(ftp)
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;      // "+ 1" becouse the 1st month is 0
    var day = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds()
    let id = year + "" + month + "" + day + "" + "" + hour + "" + minutes + "" + seconds;
    file.originalname = id + file.originalname.replace(/^.*\./, '.');
    callback(null, path.join(options.basepath, file.originalname).replace(/\\/g, "/"))

  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
});


router.post("/ajouter/", (req, res) => {

  const newdonArgent = new DonArgent({
    nom: req.body.nom,
    file: req.body.file,
    prenom: req.body.prenom,
    email: req.body.email,
    montant: req.body.montant,
    montantlettre: req.body.montantlettre,
    raisonsociale: req.body.raisonsociale,
    identifiant: req.body.identifiant,
    adresse: req.body.adresse,
    codepostal: req.body.codepostal,
    commune: req.body.commune,
    type: req.body.type
  });
  newdonArgent.save(req.body.donAgent)
    .then(donAgent => res.json(donAgent))
    .catch(err => console.log(err));
});

router.post('/file', upload.single('ImageProduct'), (req, res, next) => {
  const file = req.file;
  const paths = "assets/img/donArgent/" + file.originalname
  console.log(paths);
  if (!file) {
    const error = new Error('please upload a file ')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file);
  ftpClient.end()
});
router.get("/supprimer/:id", (req, res) => {
  DonArgent.remove({ _id: req.params.id })
    .then(donArgent => res.json(donArgent))
    .catch(err => console.log(err));
});

router.get("/", (req, res) => {
  DonArgent.find({})
    .then(donArgent => res.json(donArgent))
    .catch(err => console.log(err));
});

module.exports = router;