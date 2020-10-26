var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://Eddo:1Landrover@codingcluster.rr02d.mongodb.net/codingsupport?retryWrites=true&w=majority",
{ useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true }, () =>
  console.log("connected to DataBase")
);

// <---------------------------------------------------------------------------- LOGIN / SIGNUP MODEL
var userSchema = mongoose.Schema({
    userName: String,
    userEmail: String,
    userPassword: String,
});
var NewUserModel = mongoose.model('newUsers', userSchema);
var isLoggedIn = false;


router.get('/', function(req, res, next) {
  NewUserModel.find(
    function(error, newUsers) {
      res.render('index', {newUsers, isLoggedIn});
    }
  )
});

router.post('/signup', function(req, res, next) {
  const {userName, userEmail, userPassword} = req.body;
  function Error() {
     this.name = "Error";
  }
  try {
    const userExist = NewUserModel.findOne({userEmail});
    if(userExist === true) {
      console.log(userExist)
      throw new Error("Cet email est déjà enregistré")
    } else {
      var newUser = new NewUserModel({
        userName,
        userEmail,
        userPassword,
      });
      newUser.save(
        function(err, newUsers) {
          console.log({newUsers});
          res.render('index', {newUsers, isLoggedIn});
        }
      )
    }
  } catch(error) {
    res.render('index', {newUsers});
    console.log('Erreur ajout user')
  }
});


module.exports = router;