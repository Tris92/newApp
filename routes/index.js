var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;

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


router.get('/auth', function(req, res, next) {
  NewUserModel.find(
    function(error, newUsers) {
      res.render('auth', {newUsers, isLoggedIn});
    }
  )
});

router.post('/signup', function(req, res, next) {
  const {userName, userEmail, userPassword} = req.body;
  try {
    const userExist = NewUserModel.findOne({userEmail});
    if(userExist) {
      throw new Error("Cet email est déjà enregistré")
    }
    var newUser = new NewUserModel({
      userName,
      userEmail,
      userPassword,
    });
    newUser.save(
      function(err, newUsers) {
        console.log(newUsers);
        res.render('index', {newUsers, isLoggedIn});
      }
    )
  } catch(error) {
    res.render('auth');
    console.log('Erreur ajout user')
  }
});


router.post('/login', function(req, res, next) {
  const {userEmail, userPassword} = req.body;
  {userEmail, userPassword}
  NewUserModel.find(
    { userEmail },
    function (err, newUsers) {
      if(newUsers.length > 0) {
        req.session.user = newUsers[0];
        isLoggedIn = true;
          res.render('index', {user : req.session.user, isLoggedIn});
        } else {
          isLoggedIn = false;
          res.render('/auth')
        }
    })
});


router.get('/logout', function(req, res, next){
  NewUserModel.find(
    function(err, newUsers){
      res.render('index', { newUser: req.session.newUser, isLoggedIn, newUsers});
      isLoggedIn = false;
    }
  )
});


module.exports = router;
