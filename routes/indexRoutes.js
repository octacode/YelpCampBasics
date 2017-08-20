var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.js')
//================
//REGISTER ROUTES
//================
router.get('/',function(req,res){
    res.render('landing.ejs');
});

router.get('/register', (req,res)=>{
  res.render('authentication/register.ejs');
});

router.post('/register', (req,res)=>{
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user)=>{
    if(err){
        console.log(err);
        res.redirect('/campgrounds');
    }
    passport.authenticate("local")(req,res, function(){
          res.redirect('/campgrounds');
    });
  });
});

//==================
//LOGIN ROUTES
//==================
router.get('/login', (req,res)=>{
    res.render('authentication/login.ejs');
});

router.post('/login', passport.authenticate("local",
        {
          successRedirect: '/campgrounds',
          failureRedirect: '/login'
        }),(req,res)=>{});

//==================
//LOGOUT
//==================
router.get('/logout', (req,res)=>{
  req.logout();
  req.flash("success", "Logged out successfully!");
  res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect('/login');
}

module.exports = router;
