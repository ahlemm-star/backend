const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

// Load Profit model
const Profit = require("../../models/Profit");
const University = require("../../models/University")
// @route POST api/profit/ajouter
// @desc ajouter profit
// @access public

router.post("/ajouter", (req, res) => {
    const NewUniversity = new University({
        title : req.body.title ,
        value: req.body.value,
        email: req.body.email,
        id_user:req.body.id_user
       } );
       NewUniversity.save()
            .then(profit => res.json(profit))
            .catch(err => console.log(err));
});

// @route DELETE api/profit/supprimer
// @desc delete profit
// @access Private
router.delete("/supprimer/:id", (req, res) => {
    University.remove({_id: req.params.id})
                .then(profit => res.json(profit))
                .catch(err => console.log(err));
});

// @route PUT api/profit/update
// @desc modifier profit
// @access Private
router.put("/modifier", (req, res) => {
    //req.body.profit = {_id:'5e865aa4c4d7200f304e7abe' , nom : 'salem' , prenom : 'ben salem'};

    University.findOne({_id: req.body._id})
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
    University.find({})
                .then(profit => res.json(profit))
                .catch(err => console.log(err));
});

// @route GET api/profit/rechercher
// @desc rechercher profit
// @access Private
router.get("/rechercher/:id", (req, res) => {
    University.find({_id: req.params.id})
                .then(profit => res.json(profit))
                .catch(err => console.log(err));
});




module.exports = router;