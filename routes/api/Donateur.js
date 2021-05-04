const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
var fs = require('fs');
const path = require('path');
const slash = require('slash');
const multer = require('multer');
var FTPStorage = require('multer-ftp')

const FTP = require('ftp');
const ftpClient = new FTP();
const ftp = {
  host: 'ftp.sharek-it.tn',
  user: 'sharek',
  password: 'GEfs23tQ6',
  keepalive: 9999999
}
const storage = new FTPStorage({
  ftp: {
    host: 'ftp.sharek-it.tn',
    user: 'sharek',
    password: 'GEfs23tQ6',
    keepalive: 9999999
  },
  connection: ftpClient,
  basepath: '/public_html/assets/img/Donateur/',
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

// Load donateur model
const Donateur = require("../../models/Donateur");

router.get("/", (req, res) => {
  Donateur.find({})
    .then(donateur => res.json(donateur))
    .catch(err => console.log(err));
});
// @route POST api/donateur/ajouter
// @desc ajouter donateur
// @access public
router.post("/ajouter/", (req, res) => {

  const newdonateur = new Donateur({
    nom: req.body.nom,
    website: req.body.website,
    image: req.body.image
  });
  // console.log(newdonateur);
  newdonateur.save(req.body.donateur)
    .then(donateur => res.json(donateur))
    .catch(err => console.log(err));
});
router.post('/file', upload.single('ImageProduct'), (req, res, next) => {

  const file = req.file;
  const paths = "assets/img/Donateur/" + file.originalname
  //console.log(paths);
  if (!file) {
    const error = new Error('please upload a file ')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file);
  ftpClient.end()
});

// @route DELETE api/donateur/supprimer
// @desc delete donateur
// @access Private
router.get("/supprimer/:id", (req, res) => {
  Donateur.remove({ _id: req.params.id })
    .then(donateur => res.json(donateur))
    .catch(err => console.log(err));
});

// @route PUT api/donateur/update
// @desc modifier donateur
// @access Private
router.get("/modifier", (req, res) => {
  req.body.donateur = { _id: '5e86d92a5b8bcf0e201ae883', nom: 'TrustIt', image: 'path', website: 5336523881 };
  Donateur.findOne({ _id: req.body.donateur._id })
    .then(donateur => {
      Donateur.updateMany({ _id: req.body.donateur._id }, { $set: req.body.donateur })
        .then(donateur => res.json(donateur))
        .catch(err => console.log(err));
    }
    )
    .catch(err => console.log(err));
});

// @route GET api/donateur/
// @desc recuperer tous les donateur
// @access Private

// @route GET api/donateur/rechercher
// @desc rechercher donateur
// @access Private
router.get("/rechercher/:nom", (req, res) => {
  Donateur.find({ nom: req.params.nom })
    .then(donateur => res.json(donateur))
    .catch(err => console.log(err));
});


module.exports = router;