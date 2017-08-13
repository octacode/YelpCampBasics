var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
var campgrounds = [
  {name: "Dog", image: "http://fakeimg.pl/350x200/?text=Dog&font=lobster"},
  {name: "Cat", image: "http://fakeimg.pl/350x200/?text=Cat&font=lobster"},
  {name: "Lion", image: "http://fakeimg.pl/350x200/?text=Lion&font=lobster"},
  {name: "Bat", image: "http://fakeimg.pl/350x200/?text=Bat&font=lobster"},
  {name: "Dog", image: "http://fakeimg.pl/350x200/?text=Dog&font=lobster"},
  {name: "Cat", image: "http://fakeimg.pl/350x200/?text=Cat&font=lobster"},
  {name: "Lion", image: "http://fakeimg.pl/350x200/?text=Lion&font=lobster"},
  {name: "Bat", image: "http://fakeimg.pl/350x200/?text=Bat&font=lobster"},
  {name: "Dog", image: "http://fakeimg.pl/350x200/?text=Dog&font=lobster"},
  {name: "Cat", image: "http://fakeimg.pl/350x200/?text=Cat&font=lobster"},
  {name: "Lion", image: "http://fakeimg.pl/350x200/?text=Lion&font=lobster"},
  {name: "Bat", image: "http://fakeimg.pl/350x200/?text=Bat&font=lobster"},
  {name: "Dog", image: "http://fakeimg.pl/350x200/?text=Dog&font=lobster"},
  {name: "Cat", image: "http://fakeimg.pl/350x200/?text=Cat&font=lobster"},
  {name: "Lion", image: "http://fakeimg.pl/350x200/?text=Lion&font=lobster"},
  {name: "Bat", image: "http://fakeimg.pl/350x200/?text=Bat&font=lobster"}]

app.get('/',function(req,res){
    res.render('landing.ejs');
});

app.get('/campgrounds', function(req,res){
  res.render('campground.ejs', {campgrounds: campgrounds});
});

app.get('/campgrounds/new', function(req,res){
  res.render('submit_a_new_campground_form.ejs');
});

app.post('/campgrounds', function(req,res){
   var name = req.body.name;
   var image = req.body.image;
   campgrounds.push({name: name, image: image});
   res.render('campground.ejs', {campgrounds: campgrounds})
  res.send("you hit the post route");
});

app.listen(1313, function(){
  console.log('Yelp Camp server sunn rha hai...')
});
