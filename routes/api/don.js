const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const Don = require("../../models/Don");
// Load User model
const User = require("../../models/User");
const multer = require("multer");
const path = require("path");
const slash = require("slash");
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
  basepath: '/public_html/assets/img/Don/',
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

router.get("/NbrDons", (req, res) => {
  Don.find({}).countDocuments()
    .then((don) => {
      res.json(don);

    })
    .catch((err) => console.log(err));
});
const storages = new FTPStorage({
  ftp: {
    host: 'ftp.sharek-it.tn',
    user: 'sharek',
    password: 'GEfs23tQ6',
    keepalive: 9999999
  },
  connection: ftpClient,
  basepath: '/public_html/assets/img/DonPub/',
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
  fileFilter: fileFilter,
});
const uploads = multer({
  storage: storages,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

router.get("/", (req, res) => {
  Don.find({})
    .then((don) => { res.json(don) })
    .catch((err) => console.log(err));
});
/*
router.post("/addDon", async(req, res) => {
  console.log("touvhed")
  const newDon = new Don({
    nom: req.body.nom,
    prenom: req.body.prenom,
    age: req.body.age,
    ville: req.body.ville,
    adresse: req.body.adresse,
    tel: req.body.tel,
    Email: req.body.Email,
    DetailDon: req.body.DetailDon,
    produitName: req.body.produitName,
    decriptionProduit: req.body.decriptionProduit,
    etat: req.body.etat,
    codepostal: req.body.codepostal,
    cin: req.body.cin,
    message: req.body.message,
    ImageProduct: req.body.ImageProduct,
    id_user: req.body.id_user,
    code_trustit: req.body.code_trustit,
    modele: req.body.modele,
    IMEI_SERIAL: req.body.IMEI_SERIAL,
    diagnostic: req.body.diagnostic,
    ImagePub: req.body.ImagePub,
    statut: "Waiting"

  });
  const getuser = await User.findById(req.body.id_user);
console.log(getuser);
  getuser.dons &&getuser.dons.push(newDon.id)
  getuser.save()
  newDon
    .save(req.body.don)
    .then((don) => res.json(don))
    .catch((err) => console.log(err));
});*/
router.post('/addDon', async (req, res) => {
  try {
      let data = req.body
      console.log(data)
      let don = new Don({ 
        nom: req.body.nom,
        prenom: req.body.prenom,
        ville: req.body.ville,
        adresse: req.body.adresse,
        tel: req.body.tel,
        Email: req.body.Email,
        gategorie: req.body.gategorie,
        etat: req.body.etat,
        ImageProduct: req.body.ImageProduct,
        id_user: req.body.id_user,
        code_trustit: req.body.code_trustit,
        modele: req.body.modele,
        IMEI_SERIAL: req.body.IMEI_SERIAL,
        diagnostic: req.body.diagnostic,
        statut:"en attend"
       
      })
      let donadd = await don.save()
      res.status(201).send({ message: 'don succefuly' })

  } catch (error) {
      res.status(400).send({ message: 'added failed', error })
  }
})

router.post('/filePub', uploads.single('ImagePub'), (req, res, next) => {
  const file = req.file;

  const paths = "assets/img/DonPub/" + file.originalname
  if (!file) {
    const error = new Error('please upload a file ')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file);
  console.log(res)
});
router.post('/file', upload.single('ImageProduct'), (req, res, next) => {
  const file = req.file;
  const paths = "assets/img/Don/" + file.originalname
  if (!file) {
    const error = new Error('please upload a file ')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file);
  console.log(res)
});

router.get("/deleteDon/:id", (req, res) => {
  Don.remove({ _id: req.params.id })
    .then((don) => res.json(don))
    .catch((err) => console.log(err));
});



router.put("/ModifyDon", (req, res) => {

  Don.findOne({ _id: req.body._id })
    .then((don) => {
      Don.updateMany({ _id: req.body._id }, { $set: req.body })
        .then((don) => {
          res.json(don);

        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});



router.get("/search/:id", (req, res) => {
  Don.find({ _id: req.params.id })
    .then((don) => res.json(don))
    .catch((err) => console.log(err));
});
router.get("/searchByUser/:id", (req, res) => {
  Don.find({ id_user: req.params.id })
    .then((don) => res.json(don))
    .catch((err) => console.log(err));
});

router.get("/ListDons/:id", (req, res) => {
  Don.find({ id_user: req.params.id })
    .then((don) => {
      res.json(don);

    })
    .catch((err) => console.log(err));
});
router.get('/all', (req, res) => {
  try {
    let don = Don.find()
    res.status(200).send(don)

  } catch (error) {
    res.status(400).send({ message: 'API failed', error })
  }
})

module.exports = router;
