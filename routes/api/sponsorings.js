const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
var fs = require('fs');
const path = require('path');
const slash = require('slash');
const multer = require('multer');
var FTPStorage = require('multer-ftp')
const FTP = require('ftp');
const Sponsoring = require("../../models/Sponsoring");

const stockage = multer.diskStorage({
  destination: 'uploads/sponsoring',
  /* fonction req f 
  wostha request ly jtna ml front file feha fichier li
   jena ml front cb n'excutiwha bsh tkhdm haja mo3ayna tbadel esm fichier ly jy mel front*/
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
    //esm tasira jdid :Date.now() concatinée lel extension  + path.extname(file.originalname)
  }
})
//check file
//check fct verifier
//mimetype=type reel taa taswira
//
  function check(file, cb)
  //cb fct bsh naaytlouha f stockage par1:ken faama err welaa null o theny true bsh ykhdm sockage
  {
    const types = /jpeg|jpg|png|gif/; //les types ly ena nhbou expression reguliere
    const verifextension = types.test(path.extname(file.originalname).toLowerCase()) //tverifi lextension 
    //test est ce que elle valide lextension lly jbtha ou nn trajaa true ou false
    //toLowerCase() ay fichier njybha nrodhaa miniscule

    const verifMime = types.test(file.mimetype) // tverifi type taa fichier

    if (verifextension && verifMime) {
      return cb(null, true) //cb:coll back fct null yaani param11 fihsh err
    } else {
      cb('invalid file type')
    }
  }
//upload
//multer constructir fih storage:win nostoki
//limits :limit taa l'image kadeh

const upload = multer({
  storage: stockage,
  limits: { fileSize: 1000000 },

  fileFilter: function (req, file, cb) {
    check(file, cb)
  }
})
/*const ftpClient = new FTP();
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
  basepath: '/public_html/assets/img/Sponsoring/',
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


// @route POST api/sponsorings/ajouter
// @desc ajouter sponsoring
// @access public*/
/*router.post("/ajouter/", (req, res) => {

  const newSpon = new Sponsoring({
    nom: req.body.nom,
    website: req.body.website,
    image: req.body.image
  });
  newSpon.save(req.body.sponsoring)
    .then(sponsoring => res.json(sponsoring))
    .catch(err => console.log(err));
});*/
router.post('/add', upload.single('ImageProduct'), async (req, res) => {
  try {
    let data = req.body
    let file = req.file //t'acceder lel fichier li jek
    let spon = new Sponsoring({
      nom: data.nom,
      image: file.filename, //data.image
      website: data.website
    })
    let sponadd = await spon.save()
    res.status(201).send({ message: 'sponsorregisted succefuly' })

  } catch (error) {
    res.status(400).send({ message: 'added failed', error })
  }
})
/*router.post('/file', upload.single('ImageProduct'), (req, res, next) => {
  const file = req.file;

  const paths = "assets/img/Sponsoring/" + file.originalname
  if (!file) {
    const error = new Error('please upload a file ')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file);
  ftpClient.end()
});*/
// @route DELETE api/sponsorings/supprimer
// @desc delete sponsoring
// @access Private
router.get("/supprimer/:id", (req, res) => {
  Sponsoring.remove({ _id: req.params.id })
    .then(sponsoring => res.json(sponsoring))
    .catch(err => console.log(err));
});

// @route PUT api/sponsorings/update
// @desc modifier sponsoring
// @access Private
/*router.get("/modifier", (req, res) => {

  req.body.sponsoring = { _id: '5e86d92a5b8bcf0e201ae883', nom: 'TrustIt', image: 'path', website: 5336523881 };

  Sponsoring.findOne({ _id: req.body.sponsoring._id })
    .then(sponsoring => {
      Sponsoring.updateMany({ _id: req.body.sponsoring._id }, { $set: req.body.sponsoring })
        .then(sponsoring => res.json(sponsoring))
        .catch(err => console.log(err));
    }
    )
    .catch(err => console.log(err));
});*/

// @route GET api/sponsorings/
// @desc recuperer tous les sponsorings
// @access Private
router.get("/", (req, res) => {
  Sponsoring.find({})
    .then(sponsoring => res.json(sponsoring))
    .catch(err => console.log(err));
});

// @route GET api/sponsoring/rechercher
// @desc rechercher sponsoring
// @access Private
router.get("/rechercher/:nom", (req, res) => {
  Sponsoring.find({ nom: req.params.nom })
    .then(sponsoring => res.json(sponsoring))
    .catch(err => console.log(err));
});

router.put('/modifier/:id', async (req, res) => {
  try {
      let myid = req.params.id;
      let data = req.body
      let updatedspon = await Sponsoring.findOneAndUpdate({ _id: myid }, data)
      if (!updatedspon ) { res.status(404).send({ message: " cord not found" }) }
      else {
          res.status(200).send({ message: "cord updated" })
      }
  } catch (error) {
      res.status(400).send({ message: 'API failed', error })
  }

})
module.exports = router;