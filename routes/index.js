const express = require("express");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const router = express.Router();
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
      req.session.user = newUsers[0]
      res.render('index', {newUsers, isLoggedIn});
    }
  )
});


router.get('/auth', function(req, res, next) {
  NewUserModel.find(
    function(error, newUsers) {
      res.render('auth', {user : req.session.user, newUsers, isLoggedIn, message:""});
    }
  )
});

router.post('/signup', async (req, res) => {
  console.log(req.body)
  const {userName, userEmail, userPassword} = req.body;
  try {
    const userExist = await NewUserModel.findOne({userEmail});
    if(userExist) {
      console.log(userExist);
      throw new Error("Cet email est déjà enregistré")
    }
    const newUser = new NewUserModel({
      userName,
      userEmail,
      userPassword,
    });
    const user = await newUser.save();
    const newUsers = await NewUserModel.find();
      req.session.user = user;
      console.log("User added !");
      res.render('index', {user, newUsers, isLoggedIn: true});
  } catch(err) {
    console.log(err)
    res.render('auth', { message: err.message, isLoggedIn: false });
  }
});


router.post('/login', async (req, res) => {
  const {userEmail, userPassword} = req.body;
  try {
    const validPassword = await NewUserModel.findOne({userPassword});
    if(!validPassword) {
      console.log(validPassword);
      throw new Error("Le mot de passe est incorrect")
    }
    const newUsers = await NewUserModel.find();
    if(newUsers.length > 0) {
      const user = newUsers[0];
      req.session.user = user;
      res.render('index', {user, newUsers, isLoggedIn: true});
    }
  } catch(err) {
    console.log(err)
    res.render('auth', { message: err.message, isLoggedIn: false });
  }
});


router.get('/logout', function(req, res, next){
  NewUserModel.find(
    function(error, newUsers) {
      res.render('index', { isLoggedIn: false, newUsers});
    }
  )
});


router.get('/homepage', function(req, res, next) {
  res.render('homepage');
});




module.exports = router;
