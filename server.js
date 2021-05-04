const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/users");
const profits = require("./routes/api/profits");
const sponsorings = require("./routes/api/sponsorings");
const dons = require("./routes/api/don");
const matching = require("./routes/api/Matching");
const partenariat = require("./routes/api/Partenariat");
const coordinateur = require("./routes/api/coordinateur");
const donateur = require("./routes/api/Donateur");
const university = require("./routes/api/university");
const donBackup = require("./routes/api/donBackup");
const demandBackup = require("./routes/api/DemandBackup");

const donArgent = require("./routes/api/donArgent");
const json2xls = require('json2xls');
const Blog = require('./routes/api/Blog')
const mail = require('./routes/api/Mail');
var multer = require('multer');
var cors = require('cors');
const Matches = require("./routes/api/Matches");
const app = express();
// Bodyparser middleware
/*app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());*/
app.use(json2xls.middleware);

var whitelist = ['https://www.sharek-it.tn', 'http://localhost:4200']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

//to fix problem of No 'Access-Control-Allow-Origin'
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true})) //ykhalili les donnees ydkhlou files
app.use(express.static('./uploads/sponsoring'));
app.use(express.static('./uploads/DonPub'));//ykhaliw les donnees accesible ml front//   res.set({
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
//     'Access-Control-Allow-Headers': '*'
//   })
//   next();
// })
 
//Multer to upload the photo on the server side.
//app.use(multer({dest:'./uploads/'}).single('photo'));


// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(
    db,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);
app.use("/api/profits", profits);
app.use("/api/sponsorings", sponsorings);
app.use("/api/dont", dons);
app.use("/api/matching", matching);
app.use("/api/partenariat", partenariat);
app.use("/api/coordinateur", coordinateur);
app.use("/api/donateur", donateur);
app.use("/api/university", university);
app.use("/api/dBackup", donBackup);
app.use("/api/deBackup", demandBackup);
app.use("/api/dontArgent", donArgent);
app.use("/api/Blog", Blog);
app.use("/api/Matches", Matches);
app.use("/api/mail",mail);

app.use(express.static('uploads/sponsoring'));

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));