const express = require('express');
const router = express.Router();
const Mail = require('../../models/Mail');
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  Mail.find({})
    .then(profit => res.json(profit))
    .catch(err => console.log(err));
});

router.post("/sendMail", (req, res) => {
  const NewMail = new Mail({
    nom: req.body.nom,
    Email: req.body.Email,
    description: req.body.description
  });
  console.log(NewMail);
  NewMail.save()
    .then(mail => {
      sendMail(NewMail, (err, info) => {
        if (err) {
          console.log(err);
          res.status(400);
          res.send({ error: "Failed to send email" });
        } else {
          console.log("Email has been sent");
          res.send(info);
        }
      });
      res.json(mail);
    })
    .catch(err => console.log(err));
});

const sendMail = (user, callback) => {
  console.log(user.Email);
  if(user.Email=='')
  {
    console.log("sorry i dont receive mail");
  }else 
  {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "ahlemriahi839@gmail.com",
        pass: "123456"
      }
    });
    const mailOptions = {
      from:  user.Email ,
      to: "ahlemriahi839@gmail.com" ,
      subject: 'Contact',
      html: "mail User : " + user.Email +" <br/>"+"<p> Description : " + user.description + "</p><img src='http://localhost:5000/assets/img/brand/Logo_Black.png'>"
    };
  
    transporter.sendMail(mailOptions, callback);
  }
 
}

module.exports = router;
