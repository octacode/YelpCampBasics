var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campgroundModel.js');
var Comment = require('../models/comment.js');

router.get('/new', isLoggedIn ,(req,res)=>{
  Campground.findById(req.params.id, (err,campground)=>{
    if(err)
      console.log(err);
    else {
      res.render('comments/new.ejs', {campground: campground});
    }
  });
});

router.post('/', isLoggedIn,(req,res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if(err) {
      console.log(err);
    }
    else {
      Comment.create(req.body.comment, (err, comment)=>{
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        comment.save();
        campground.comments.push(comment);
        campground.save();
        console.log(comment);
        res.redirect('/campgrounds/'+req.params.id);
      });
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
