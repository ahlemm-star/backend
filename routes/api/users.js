const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");
const Don = require("../../models/Don");
const nodemailer = require('nodemailer');

// @route GET api/users/
// @desc recuperer tous les utilisateurs
// @access Private
router.get("/", (req, res) => {
    Don.distinct('Email')
        .then(user => res.json(user))
        .catch(err => console.log(err));
});

// @route GET api/users/list
// @desc recuperer tous les utilisateurs
// @access Private
router.get("/list", (req, res) => {
    User.find({})
        .then((don) => { res.json(don) })
        .catch((err) => console.log(err));
});

// @route POST api/users/role
// @desc recuperer tous les role de l'utilisateur
// @access Private
router.post("/userRole", (req, res) => {
    User.findById( req.body.id )
        .then((user) => { res.json(user.role) })
        .catch((err) => console.log(err));
});

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: ['user']
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation
   console.log("ldf");
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    //populate taaml ref tkhou id don o b ref athika tcompary
    // entre les tables ded don o ki tala wahda kifha tkharjha kif ma hya
    User.findOne({ email }).populate("dons").then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            user: user,
                            success: true,
                            user: user,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

// @route POST api/users/sendAccount/:username/:email/:password
// @desc Send Email to user contain Accout information
// @access Private
router.get("/sendAccount/:username/:email/:password", (req, res) => {
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "74fec78ed124e8",
            pass: "13ebeed3ad3f00"
        }
    });

    const message = {
        from: 'keeptooui@gmail.com', // Sender address
        to: req.params.email,         // List of recipients
        subject: 'Compte Sharek ', // Subject line
        text: 'Bonjour Ms,Mme ' + req.params.username + ',  Voici votre donnes du compte Sharek  Email: ' + req.params.email + ' mot de passe: ' + req.params.password + ' Bien cordialement.' // Plain text body
    };
    transport.sendMail(message, function (err, info) {
        if (err) {
            res.json(err)
        } else {
            res.json(info);
        }
    });

});

// @route POST api/users/contact/:username/:email/:password
// @desc Send Email to user contain Accout information
// @access Private
router.get("/contact/:username/:email/:message", (req, res) => {
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "74fec78ed124e8",
            pass: "13ebeed3ad3f00"
        }
    });

    const message = {
        from: req.params.email, // Sender address
        to: 'Service-Sharek@gamil.com',         // List of recipients
        subject: 'Compte Sharek ', // Subject line
        text: req.params.message // Plain text body
    };
    transport.sendMail(message, function (err, info) {
        if (err) {
            res.json(err)
        } else {
            res.json(info);
        }
    });

});
router.get("/NbrUsers", (req, res) => {
    Don.distinct('Email')
        .then((don) => {
            res.json(don.length);

        })
        .catch((err) => console.log(err));
});
router.post("/registerUniversity", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: 'university'
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// @route POST api/users/role
// @desc chnage user role
// @access Public
router.put("/role", (req, res) => {
    User.updateOne({ _id: req.body._id }, { $set: { role: req.body.role } })
        .then(user => res.json(user))
        .catch(err => console.log(err));

});

router.get("/reset/:email", (req, res) => {

    var date = new Date();
    // Hours part from the timestamp
    var time = date.getTime();

    User.findOne({ email: req.params.email }).then(user => {
        console.log(user);
        var transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "habib.chaabene@esprit.tn",
                pass: "183JFT0485"
            }
        });
        // var currentDateTime = new Date();
        const message = {
            from: 'habib.chaabene@esprit.tn', // Sender address
            to: user.email,         // List of recipients
            subject: 'reset password ', // Subject line
            html: "<p> welcome " + user.name + "</p> <br/>" +
                "<p>  if you are requeested to reset your password then click on bellew <br/></p>" +
                "<a href='http://localhost:4200/change-password/"   + time + "?time=" +time + "'" + ">click here </a>"

        };
        transport.sendMail(message, function (err, info) {
            if (err) {
                res.json(err)
            } else {
                //   res.json(info);
                User.updateOne({ email: user.email }, { token: time }, { multi: true }, function (err, affected, resp) {
                    return res.status(200).json({
                        success: time,
                        msg: user.email
                    });
                });
            }
        });

    });
});

router.post("/updatePassword", (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            req.body.user = { _id: user._id, name: user.name, email: req.body.email, password: req.body.password };

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.user.password, salt, (err, hash) => {
                    if (err) throw err;
                    req.body.user.password = hash;


                    User.updateMany({ _id: req.body.user._id }, { $set: req.body.user })
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
        )
        .catch(err => console.log(err));
    /*   User.findOne({ email: req.body.email }).then(user => {
        console.log(user._id );
        let id = user._id ; 
        if (!user) {
            return res.status(400).json({ email: "Email Not exists" });
        } else {
            const newUser = new User(
                {
                name: 'user.name',
            });
            

            // Hash password before saving in database
      /*       bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                     User.updateMany({  _id: '5f6e5a7dddfcb30004ea5b0b' }, {
                        $set: newUser
                      })
                      .then(user => res.json(user))
                      .catch(err => console.log(err)); 
                });
            }); 
        }
    });*/
});
module.exports = router;