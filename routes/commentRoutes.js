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

router.get('/:comment_id/edit', (req,res)=>{
  Comment.findById(req.params.comment_id, (err, comment)=>{
    if(err)
      console.log(err);
    else
      res.render('comments/edit.ejs', {comment: comment, campgroundId: req.params.id});
  });
});

router.post('/:comment_id/update', (req,res)=>{
  var text = req.body.text;
  var author = {
      id: req.user._id,
      username: req.user.username
  };

  var updatedComment = {
    text: text,
    author: author
  };

  console.log(updatedComment);

  Comment.findByIdAndUpdate(req.params.comment_id, updatedComment, (err, comment)=>{
    if(err)
      console.log(err);
    else
      res.redirect('/campgrounds/'+req.params.id);
  });
});


router.post('/:comment_id/delete', (req,res)=>{
  Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
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
