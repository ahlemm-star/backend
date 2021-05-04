const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const Matching = require("../../models/Matching"); 
router.get("/", (req, res) => {
    Matching.find({})
                .then(Matching =>{res.json(Matching)} )
                .catch(err => console.log(err));
});




router.post("/addMatching", (req, res) => {
        const newMatch = new Matching({ 
        idDon : req.body.idDon ,
        idProfit : req.body.idProfit ,  
        etat : req.body.etat,
        code_logistique: req.body.code_logistique
         });
newMatch.save(req.body.match)
.then(sponsoring => res.json(sponsoring))
.catch(err => console.log(err));
    });



router.get("/deleteMatching/:id", (req, res) => {
    Matching.remove({_id: req.params.id})
    .then(matching  => res.json(matching))
    .catch(err => console.log(err));
});

router.get("/deleteall", (req, res) => {
    Matching.remove({})
    .then(matching  => res.json(matching))
    .catch(err => console.log(err));
});
router.put("/ModifyMatching", (req, res) => {
  


            Matching.updateOne({_id: req.body._id} , {$set  :req.body})
            .then(matching => res.json(matching))
            .catch(err => console.log(err));
    
});

router.get("/rechercher/:id", (req, res) => {
    Matching.find({_id: req.params.id})
                .then(profit => res.json(profit))
                .catch(err => console.log(err));
});

router.get("/rechercherByIdDon/:id", (req, res) => {
    Matching.find({idDon: req.params.id})
                .then(profit => res.json(profit))
                .catch(err => console.log(err));
});
router.get("/rechercherIdProfit/:id", (req, res) => {
    Matching.find({idProfit: req.params.id})
                .then(profit => res.json(profit))
                .catch(err => console.log(err));
});
module.exports = router;