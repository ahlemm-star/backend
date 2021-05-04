const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const fs = require('fs');
const http = require('http');
const json2xls = require('json2xls');
var path = require("path");

// Load Profit model
const Profit = require("../../models/Profit");

// @route POST api/profit/ajouter
// @desc ajouter profit
// @access public
router.get("/", (req, res) => {
    Profit.find({})
        .then(profit => res.json(profit))
        .catch(err => console.log(err));
});
router.post("/ajouter", (req, res) => {
    const NewProfit = new Profit({
        nom: req.body.nom,
        prenom: req.body.prenom,
        age: req.body.age,
        ville: req.body.ville,
        adresse: req.body.adresse,
        tel: req.body.tel,
        Email: req.body.Email,
        codepostal: req.body.codepostal,
        cin: req.body.cin,    
        nom_universite: req.body.nom_universite,
        specialite: req.body.specialite,
        etablissement: req.body.etablissement,
        niveau_scolarite: req.body.niveau_scolarite,
        besoin: req.body.besoin,
         id_user: req.body.id_user,
        detail: req.body.detail,
        etat: "Waiting"
    });
    console.log(NewProfit)
     NewProfit.save()
        .then(profit => res.json(profit))
        .catch(err => console.log(err)); 
});









// @route DELETE api/profit/supprimer
// @desc delete profit
// @access Private
router.delete("/supprimer/:id", (req, res) => {
    Profit.remove({
            _id: req.params.id
        })
        .then(profit => res.json(profit))
        .catch(err => console.log(err));
});

// @route PUT api/profit/update
// @desc modifier profit
// @access Private

router.put("/modifier/:id", async(req, res) => {
    
        
    try {
        let myid = req.params.id;
        let data = req.body
        let updatedprof= await Profit.findOneAndUpdate({ _id: myid }, data)
        if (!updatedprof) { res.status(404).send({ message: " profit not found" }) }
        else {
            res.status(200).send({ message: "profit updated" })
        }
    } catch (error) {
        res.status(400).send({ message: 'API failed', error })
    }

})

    // req.body.profit = {
    //   _id: req.body._id,
    //   nom: req.body.nom,
    //   prenom: req.body.prenom,
    //   age: req.body.age , 
    //   ville : req.body.ville ,
    //   codepostal : req.body.codepostal,
    //   adresse : req.body.adresse,
    //   tel : req.body.tel , 
    //   cin : req.body.cin , 
    //   Email : req.body.Email,
    //   nom_universite : req.body.nom_universite,
    //   niveau_scolarite : req.body.niveau_scolarite,
    //   specialite : req.body.specialite , 
    //   etablissement : req.body.etablissement , 
    //   besoin : req.body.besoin , 
    //   detail : req.body.detail , 
    //   etat : req.body.etat , 
    //   id_user : req.body.id_user
    // };
    // console.log(req.body.profit);
    /*Profit.findOne({_id : req.body._id}).then( p => {
        console.log(p);
        console.log(req.body._id);

        Profit.updateMany({
            _id: req.body._id
          }, {
            $set: req.body
          })
          .then(profit => res.json(profit))
          .catch(err => console.log(err));
    });
  });

// @route GET api/profit/
// @desc recuperer tous les profits
// @access Private
router.get("/", (req, res) => {
    Profit.find({})
        .then(profit => res.json(profit))
        .catch(err => console.log(err));
});
*/
router.get('/all', (req, res) => {
    try {
        let prof =Profit.find()
        res.status(200).send(prof)

    } catch (error) {
        res.status(400).send({ message: 'API failed', error })
    }
})

router.get("/extracEcole", (req, res) => {

    var pathDel = process.cwd();
    var pathDelete = pathDel.replace(/\\/g, "/");
    var finalFile = pathDelete + '/ecole.xlsx';
    fs.unlink(finalFile, (err) => {
        Profit.find({
            nom_universite: null /*etablissement: null*/
        })
        .then(profit => {
          //  res.json(profit);
            let list = [];
            for (var attributename in profit) {
                //   list.push(profit[attributename]);
                //  console.log(attributename+": "+profit[attributename].age);
                list.push({
                    nom: profit[attributename].nom,
                    prenom: profit[attributename].prenom,
                    Email: profit[attributename].Email,
                    age: profit[attributename].age,
                    ville: profit[attributename].ville,
                    adresse: profit[attributename].adresse,
                    etablissement: profit[attributename].etablissement,
                    niveau_scolarite: profit[attributename].niveau_scolarite

                });
            }
          //  console.log(list);
            //console.log(profit.length); 
            var xls = json2xls(list);
            fs.writeFileSync('ecole.xlsx', xls, 'binary');
        })
        .catch(err => console.log(err));

    });

    setTimeout(function2, 10000);

    function function2() {
        // all the stuff you want to happen after that pause
        var path = process.cwd();
        var path2 = path.replace(/\\/g, "/");
        finalPathDownload = path2 + "/ecole.xlsx";
        console.log(finalPathDownload);
        res.sendFile(finalPathDownload);
    }
    
});

router.get("/extracUniversite", (req, res) => {
    var pathDel = process.cwd();
    var pathDelete = pathDel.replace(/\\/g, "/");
    var finalFile = pathDelete + '/instut.xlsx';
   
    fs.unlink(finalFile, (err) => {


        Profit.find({
                etablissement: null
            })
            .then(profit => {
                // res.json(profit);
                let list = [];
                for (var attributename in profit) {
                    //   list.push(profit[attributename]);
                    //  console.log(attributename+": "+profit[attributename].age);
                    list.push({
                        nom: profit[attributename].nom,
                        prenom: profit[attributename].prenom,
                        Email: profit[attributename].Email,
                        age: profit[attributename].age,
                        ville: profit[attributename].ville,
                        adresse: profit[attributename].adresse,
                        etablissement: profit[attributename].etablissement,
                        niveau_scolarite: profit[attributename].niveau_scolarite
                    });
                }
                var xls = json2xls(list);
                fs.writeFileSync('instut.xlsx', xls, 'binary');
            })
            .catch(err => console.log(err));
    });

    setTimeout(function2, 10000);

    function function2() {
        // all the stuff you want to happen after that pause
        var path = process.cwd();
        var path2 = path.replace(/\\/g, "/");
        finalPathDownload = path2 + "/instut.xlsx";
        console.log(finalPathDownload);
        res.sendFile(finalPathDownload);
    }
});
//list par university
router.get("/byuniversity/:iduniversity", async(req, res) => {
   
    Profit.find({id_user:req.params.iduniversity})
    
        .then(profit => res.json(profit))
        .catch(err => console.log(err));
});

router.get("/deleteTrash", (req, res) => {
    Profit.find({
            nom: "",
            prenom: ""
        })
        .then(profit => {
            let list = [];
            for (var attributename in profit) {
                list.push(profit[attributename]._id);
            }
            list.forEach(element => {
                req.params.id = element;
                Profit.remove({
                        _id: req.params.id
                    })
                    .then(profit => res.json(profit))
                    .catch(err => console.log(err));
                // console.log(element);
            });
        })
        .catch(err => console.log(err));
});
    // @route GET api/profit/rechercher
// @desc rechercher profit
// @access Private
router.get("/rechercher/:id", (req, res) => {
    Profit.find({
            _id: req.params.id
        })
        .then(profit => res.json(profit))
        .catch(err => console.log(err));
});
router.get("/rechercherByUser/:id", (req, res) => {
    Profit.find({
            id_user: req.params.id
        })
        .then(profit => {
            res.json(profit)
            
        })
        .catch(err => console.log(err));
});
router.get("/rechercherByUniversity/:id", (req, res) => {
    Profit.find({
            nom_universite: req.params.id
        })
        .then(profit => {
            res.json(profit);
        })
        .catch(err => console.log(err));
});
router.get("/NbrDemands", (req, res) => {
    Profit.find({ }).countDocuments()
        .then(profit => { res.json(profit); })
        .catch(err => console.log(err));
});
module.exports = router;