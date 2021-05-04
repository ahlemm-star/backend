const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
var fs = require('fs');
const path = require('path');
const slash = require('slash');
const multer = require('multer');
var FTPStorage = require('multer-ftp')
const Partenariat = require("../../models/partenariat");
const partenariat = require("../../models/partenariat");
const stockage = multer.diskStorage({
  destination: 'uploads/sponsoring',
  
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  
  }
})

function check(file, cb)
{
  const types = /jpeg|jpg|png|gif/; 
  const verifextension = types.test(path.extname(file.originalname).toLowerCase()) 
 

  const verifMime = types.test(file.mimetype) 

  if (verifextension && verifMime) {
    return cb(null, true) 
  } else {
    cb('invalid file type')
  }
}


const upload = multer({
  storage: stockage,
  limits: { fileSize: 1000000 },

  fileFilter: function (req, file, cb) {
    check(file, cb)
  }
})
router.post('/add', upload.single('ImageProduct'), async (req, res) => {
  try {
    let data = req.body
    let file = req.file 
    let par = new partenariat({
      nom: data.nom,
      image: file.filename, 
      website: data.website
    })
    let paradd = await par.save()
    res.status(201).send({ message: 'sponsorregisted succefuly' })

  } catch (error) {
    res.status(400).send({ message: 'added failed', error })
  }
})
router.get("/", (req, res) => {
  Partenariat.find({})
    .then(partenariat => res.json(partenariat))
    .catch(err => console.log(err));
});

/*
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
  basepath: '/public_html/assets/img/Partenariat/',
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

// Load Sponsoring model


// @route POST api/partenariat/ajouter
// @desc ajouter partenariat
// @access public
router.post("/ajouter/", (req, res) => {

  const newpartenariat = new Partenariat({
    nom: req.body.nom,
    website: req.body.website,
    image: req.body.image
  });
  newpartenariat.save(req.body.partenariat)
    .then(partenariat => res.json(partenariat))
    .catch(err => console.log(err));
});
router.post('/file', upload.single('ImageProduct'), (req, res, next) => {
  const file = req.file;
  const paths = "assets/img/Partenariat/" + file.originalname
  if (!file) {
    const error = new Error('please upload a file ')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file);
  ftpClient.end()
});*/

// @route DELETE api/partenariat/supprimer
// @desc delete partenariat
// @access Private
router.get("/supprimer/:id", (req, res) => {
  Partenariat.remove({ _id: req.params.id })
    .then(partenariat => res.json(partenariat))
    .catch(err => console.log(err));
});

// @route PUT api/partenariat/update
// @desc modifier partenariat
// @access Private
router.get("/modifier", (req, res) => {
  req.body.partenariat = { _id: '5e86d92a5b8bcf0e201ae883', nom: 'TrustIt', image: 'path', website: 5336523881 };
  Partenariat.findOne({ _id: req.body.partenariat._id })
    .then(partenariat => {
      Partenariat.updateMany({ _id: req.body.partenariat._id }, { $set: req.body.partenariat })
        .then(partenariat => res.json(partenariat))
        .catch(err => console.log(err));
    }
    )
    .catch(err => console.log(err));
});

// @route GET api/partenariat/
// @desc recuperer tous les partenariat
// @access Private

// @route GET api/partenariat/rechercher
// @desc rechercher partenariat
// @access Private
/*router.get("/rechercher/:nom", (req, res) => {
  Sponsoring.find({ nom: req.params.nom })
    .then(sponsoring => res.json(sponsoring))
    .catch(err => console.log(err));
});

*/
module.exports = router;