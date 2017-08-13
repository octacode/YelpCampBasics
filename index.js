var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/yelp_camp", {
  useMongoClient: true
});

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
})

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Cat", image: "http://fakeimg.pl/350x200/?text=Cat&font=lobster"
//   },function(err, campground){
//     if(err){
//       console.log("Something went wrong.")
//     }
//     else{
//       console.log("The new campground inserted is: ");
//       console.log(campground);
//     }
//   }
// )

app.use(bodyParser.urlencoded({extended: true}));

app.get('/',function(req,res){
    res.render('landing.ejs');
});

app.get('/campgrounds', function(req,res){
  Campground.find({}, function(err, campgrounds){
      if(err){
        console.log("ERROR fetching from data base.");
      }
      else{
        res.render('campground.ejs', {campgrounds: campgrounds});
      }
  });
});

app.get('/campgrounds/new', function(req,res){
  res.render('submit_a_new_campground_form.ejs');
});

app.post('/campgrounds', function(req,res){
   var name = req.body.name;
   var image = req.body.image;

   Campground.create({
     name: name,
     image: image
   }, function(err, campground){
      if(err)
        console.log("Error while inserting!");
      else{
        res.redirect('/campgrounds');
      }
   });
});

app.listen(1313, function(){
  console.log('Yelp Camp server sunn rha hai...')
});
