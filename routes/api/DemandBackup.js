const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
// Load Profit model

const  ProfitBackup = require ("../../models/demandBackup")
// @route POST api/profit/ajouter
// @desc ajouter profit
// @access public

router.post("/ajouter", (req, res) => {


    
    const demand = new ProfitBackup({
        user: req.body.user,
        nom : req.body.nom ,
         prenom : req.body.prenom ,
          age:req.body.age,
           ville :req.body.ville,
        adresse: req.body.adresse,
         tel: req.body.tel,
         Email:req.body.Email 
        ,codepostal : req.body.codepostal ,
        cin : req.body.cin ,
        nom_universite :req.body.nom_universite ,
         niveau_scolarite:req.body.niveau_scolarite,

         specialite:req.body.specialite ,
          etablissement:req.body.etablissement,
          besoin:req.body.besoin,id_user:req.body.id_user,
          detail:req.body.detail} );
       demand.save()
            .then(profit => res.json(profit))
            .catch(err => console.log(err));
});

// @route DELETE api/profit/supprimer
// @desc delete profit
// @access Private
router.delete("/supprimer/:id", (req, res) => {
    ProfitBackup.remove({_id: req.params.id})
                .then(profit => res.json(profit))
                .catch(err => console.log(err));
});

// @route PUT api/profit/update
// @desc modifier profit
// @access Private
router.put("/modifier", (req, res) => {
    //req.body.profit = {_id:'5e865aa4c4d7200f304e7abe' , nom : 'salem' , prenom : 'ben salem'};

    ProfitBackup.findOne({_id: req.body._id})
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
    ProfitBackup.find({})
                .then(profit => res.json(profit))
                .catch(err => console.log(err));
});

// @route GET api/profit/rechercher
// @desc rechercher profit
// @access Private
router.get("/rechercher/:id", (req, res) => {
    ProfitBackup.find({_id: req.params.id})
                .then(profit => res.json(profit))
                .catch(err => console.log(err));
});


module.exports = router;