const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

// Load Profit model

const  DonBackup = require ("../../models/donBackup")
// @route POST api/profit/ajouter
// @desc ajouter profit
// @access public

router.post("/ajouter", (req, res) => {
    const DonBacku = new DonBackup({
        user : req.body.user,
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
        code_trustit : req.body.code_trustit,
        modele : req.body.modele,
        IMEI_SERIAL: req.body.IMEI_SERIAL,
        diagnostic: req.body.diagnostic,
        
      });

       
       DonBacku.save()
            .then(profit => res.json(profit))
            .catch(err => console.log(err));
});

// @route DELETE api/profit/supprimer
// @desc delete profit
// @access Private
router.delete("/supprimer/:id", (req, res) => {
    DonBackup.remove({_id: req.params.id})
                .then(profit => res.json(profit))
                .catch(err => console.log(err));
});

// @route PUT api/profit/update
// @desc modifier profit
// @access Private
router.put("/modifier", (req, res) => {
    //req.body.profit = {_id:'5e865aa4c4d7200f304e7abe' , nom : 'salem' , prenom : 'ben salem'};

    DonBackup.findOne({_id: req.body._id})
        .then(profit => {
            University.updateMany({_id: req.body._id} , {$set :req.body})
            .then(profit => res.json(profit))
            .catch(err => console.log(err));}
        )
        .catch(err => console.log(err));
});

// @route GET api/profit/
// @desc recuperer tous les profits
// @access Private
router.get("/", (req, res) => {
    DonBackup.find({})
                .then(profit => res.json(profit))
                .catch(err => console.log(err));
});

// @route GET api/profit/rechercher
// @desc rechercher profit
// @access Private
router.get("/rechercher/:id", (req, res) => {
    DonBackup.find({_id: req.params.id})
                .then(profit => res.json(profit))
                .catch(err => console.log(err));
});


module.exports = router;