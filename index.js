var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require("./models/campgroundModel.js"),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    seedDb = require("./seeds.js"),
    User = require("./models/user.js"),
    Comment = require("./models/comment.js");

mongoose.connect("mongodb://localhost/yelp_camp", {
  useMongoClient: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
seedDb();

//=================
//PASSPORT CONFIGURATION
//=================
app.use(require('express-session')({
  secret: "I just want to be rich.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==================
//ROUTES
//==================
app.get('/',function(req,res){
    res.render('landing.ejs');
});

app.get('/campgrounds', function(req,res){
  Campground.find({}, function(err, campgrounds){
      if(err){
        console.log("ERROR fetching from data base.");
      }
      else{
        res.render('campgrounds/campground.ejs', {campgrounds: campgrounds});
      }
  });
});

app.get('/campgrounds/new', function(req,res){
  res.render('campgrounds/submit_a_new_campground_form.ejs');
});

app.get('/campgrounds/:id', function(req,res){
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampGround){
    if(err){
      console.log("Nothing found");
    }
    else{
      console.log(foundCampGround);
      res.render('campgrounds/showCampground.ejs', {campground: foundCampGround});
    }
  });
});

app.post('/campgrounds', function(req,res){
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;

   Campground.create({
     name: name,
     image: image,
     description: description
   }, function(err, campground){
      if(err)
        console.log("Error while inserting!");
      else{
        res.redirect('/campgrounds');
      }
   });
});

//==========================================
//COMMENT ROUTES
//==========================================

app.get('/campgrounds/:id/comments/new', (req,res)=>{
  Campground.findById(req.params.id, (err,campground)=>{
    if(err)
      console.log(err);
    else {
      res.render('comments/new.ejs', {campground: campground});
    }
  });
});

app.post('/campgrounds/:id/comments', (req,res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if(err) {
      console.log(err);
    }
    else {
      console.log(req.body.comment);
      Comment.create(req.body.comment, (err, comment)=>{
        campground.comments.push(comment);
        campground.save();
        res.redirect('/campgrounds/'+req.params.id);
      });
    }
  });
});


//================
//REGISTER ROUTES
//================
app.get('/register', (req,res)=>{
  res.render('authentication/register.ejs');
});

app.post('/register', (req,res)=>{
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user)=>{
    if(err){
        console.log(err);
        res.redirect('/');
    }
    passport.authenticate("local")(req,res, function(){
          res.redirect('/campgrounds');
    });
  });
});

//==================
//LOGIN ROUTES
//==================
app.get('/login', (req,res)=>{
    res.render('authentication/login.ejs');
});

app.post('/login', passport.authenticate("local",
        {
          successRedirect: '/campgrounds',
          failureRedirect: '/login'
        }),(req,res)=>{});

app.listen(1313, function(){
  console.log('Yelp Camp server sunn rha hai...')
});
