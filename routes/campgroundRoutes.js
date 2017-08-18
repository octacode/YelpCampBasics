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
   var price = req.body.price;
   var author = {
     id: req.user._id,
     username: req.user.username
   }
   Campground.create({
     name: name,
     image: image,
     price: price,
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

router.get('/:id/edit', isLoggedIn, (req,res)=>{
  Campground.findById(req.params.id, (err, foundCampGround)=>{
    if(err)
      console.log(err);
    else
      res.render('campgrounds/edit.ejs', {campground: foundCampGround});
  });
});

router.post('/:id/update', isLoggedIn, (req,res)=>{
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var price = req.body.price;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var updatedCampground = {
    name: name,
    image: image,
    description: description,
    price: price,
    author: author
  };

  Campground.findByIdAndUpdate(req.params.id, updatedCampground, (err, campground)=>{
    if(err)
      console.log(err);
    else {
      res.redirect('/campgrounds/'+req.params.id);
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
