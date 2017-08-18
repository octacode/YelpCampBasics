var express = require('express');
var router = express.Router();
var Campground = require('../models/campgroundModel.js');

router.get('/', function(req,res){
  Campground.find({}, function(err, campgrounds){
      if(err){
        console.log("ERROR fetching from data base.");
      }
      else{
        res.render('campgrounds/campground.ejs', {campgrounds: campgrounds, currentUser: req.user});
      }
  });
});

router.get('/new', isLoggedIn,function(req,res){
  res.render('campgrounds/submit_a_new_campground_form.ejs');
});

router.get('/:id', function(req,res){
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampGround){
    if(err){
      console.log("Nothing found");
    }
    else{
      console.log(req.user);
      res.render('campgrounds/showCampground.ejs', {campground: foundCampGround, currentUserId: req.user});
    }
  });
});

router.post('/', isLoggedIn, function(req,res){
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   var author = {
     id: req.user._id,
     username: req.user.username
   }
   Campground.create({
     name: name,
     image: image,
     description: description,
     author: author
   }, function(err, campground){
      if(err)
        console.log("Error while inserting!");
      else{
        res.redirect('/campgrounds');
      }
   });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/login');
}

module.exports = router;
