const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
var fs = require('fs');
const Coordinateur = require("../../models/coordinateur");
const path = require('path');
const slash = require('slash');
const multer = require('multer');
var FTPStorage = require('multer-ftp');
const coordinateur = require("../../models/coordinateur");
/*String.prototype.replaceAll = function (target, replacement) {
  return this.split(target).join(replacement);
}; */

/*const FTP = require('ftp');
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
  basepath: '/public_html/assets/img/Coordinateur/',
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


/* const storage = new FTPStorage({
  basepath: '/public_html/assets/',
  ftp: {
    host: 'ftp.sharek-it.tn',
    user: 'sharek',
    password: 'GEfs23tQ6'
  },
  destination: function (req, file, options, callback) {
    callback(null, path.join(options.basepath, path.extname(file.originalname)).replace(/\\/g, "/")) // custom file destination, file extension is added to the end of the path
    console.log('test'+options.basepath)
  }
}); */
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

const upload2 = multer({
  storage: stockage,
  limits: { fileSize: 1000000 },

  fileFilter: function (req, file, cb) {
    check(file, cb)
  }
})

const fileFilter = (req, file, cb) => {

  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Load Sponsoring model



// @route POST api/sponsorings/ajouter
// @desc ajouter sponsoring
// @access publicù
/*router.post("/ajouter/", (req, res) => {

  const newcoordinateur = new Coordinateur({
    nom: req.body.nom,
    website: req.body.website,
    image: req.body.image
  });
  newcoordinateur.save(req.body.coordinateur)
    .then(coordinateur => res.json(coordinateur))
    .catch(err => console.log(err));
});
router.post('/file', upload.single('ImageProduct'), (req, res, next) => {
  const file = req.file;
  const paths = "assets/img/Coordinateur/" + file.originalname
  if (!file) {
    const error = new Error('please upload a file ')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file);
  ftpClient.end()
});
*/
//ajouter
router.post('/add', upload2.single('ImageProduct'), async (req, res) => {
  try {
    let data = req.body
    let file = req.file //t'acceder lel fichier li jek
    let cord = new Coordinateur({
      nom: data.nom,
      image: file.filename, //data.image
      website: data.website,
      
    })
    let cordadd = await cord.save()
    res.status(201).send({ message: 'sponsorregisted succefuly' })

  } catch (error) {
    res.status(400).send({ message: 'added failed', error })
  }
})
// @route DELETE api/sponsorings/supprimer
// @desc delete sponsoring
// @access Private


// @route PUT api/sponsorings/update
// @desc modifier sponsoring
// @access Private
/*router.get("/modifier", (req, res) => {
  req.body.coordinateur = { _id: '5e86d92a5b8bcf0e201ae883', nom: 'TrustIt', image: 'path', website: 5336523881 };
  Coordinateur.findOne({ _id: req.body.coordinateur._id })
    .then(coordinateur => {
      Coordinateur.updateMany({ _id: req.body.coordinateur._id }, { $set: req.body.coordinateur })
        .then(coordinateur => res.json(coordinateur))
        .catch(err => console.log(err));
    }
    )
    .catch(err => console.log(err));
});*/
/*
router.get("/all", async (req, res) => {
  try {
      let cord = await Coordinateur.find()
      res.status(200).send(cord)

  } catch (error) {
      res.status(400).send({ message: 'API failed', error })
  }
})
*/

// @route GET api/sponsorings/
// @desc recuperer tous les sponsorings
// @access Private

// @route GET api/sponsoring/rechercher
// @desc rechercher sponsoring
// @access Private
//recherche
/*router.get('/one/:id', async (req, res) => {
  try {
      let myid = req.params.id;

      let cord = await coordinateur.findOne({ _id: myid })

      if (!cord) {
          res.status(404).send({ message: "cord not found" })
      }
      else {
          res.status(200).send(cord)
      }

  } catch (error) {
      res.status(400).send({ message: 'API failed', error })
  }
})
//supprimer
router.delete('/delete/:id', async (req, res) => {
  try {
      let id = req.params.id
      let deletedcord = await coordinateur.findOneAndDelete({ _id: id })
      if (!deletedcord) {
          res.status(404).send({ message: 'cord not found' })
      }
      else {
          res.status(200).send({ message: ' cord deleted' })
      }
  } catch (error) {
      res.status(400).send({ message: 'API failed', error })
  }

})
//modifier
router.put('/updateinfo/:id', async (req, res) => {
  try {
      let myid = req.params.id;
      let data = req.body
      let updatedcord = await coordinateur.findOneAndUpdate({ _id: myid }, data)
      if (!updatedcord ) { res.status(404).send({ message: " cord not found" }) }
      else {
          res.status(200).send({ message: "cord updated" })
      }
  } catch (error) {
      res.status(400).send({ message: 'API failed', error })
  }

})*/
router.get("/supprimer/:id", (req, res) => {
  coordinateur.remove({ _id: req.params.id })
    .then(coordinateur=> res.json(coordinateur))
    .catch(err => console.log(err));
});




router.get("/", (req, res) => {
  coordinateur.find({})
    .then(coordinateur => res.json(coordinateur))
    .catch(err => console.log(err));
});
router.get("/rechercher/:nom", (req, res) => {
coordinateur.find({ nom: req.params.nom })
    .then(coordinateur=> res.json(coordinateur))
    .catch(err => console.log(err));
});

router.put('/modifier/:id', async (req, res) => {
  try {
      let myid = req.params.id;
      let data = req.body
      let updatedcon = await coordinateur.findOneAndUpdate({ _id: myid }, data)
      if (!updatedcon) { res.status(404).send({ message: " cord not found" }) }
      else {
          res.status(200).send({ message: "cord updated" })
      }
  } catch (error) {
      res.status(400).send({ message: 'API failed', error })
  }

})

















module.exports = router;
