var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require("./models/campgroundModel.js"),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    seedDb = require("./seeds.js"),
    User = require("./models/user.js"),
    Comment = require("./models/comment.js"),
    campgroundRoutes = require("./routes/campgroundRoutes.js"),
    commentRoutes = require("./routes/commentRoutes.js"),
    indexRoutes = require("./routes/indexRoutes.js");

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
app.use((req,res, next)=>{
  res.locals.currentUser = req.user;
  next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(indexRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
app.use('/campgrounds',campgroundRoutes);

app.listen(1313, function(){
  console.log('Yelp Camp server sunn rha hai...')
});
