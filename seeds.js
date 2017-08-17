var Campground = require("./models/campgroundModel.js");
var mongoose = require("mongoose");
var Comment = require('./models/comment.js')

var data = [
  {
    name: "Mountain View",
    image: "https://www.hellobc.com/getmedia/1ec4bda7-6729-4088-a1df-435506be14c0/4-3544-Island-Lake-camping.jpg.aspx",
    description: "One of the best"
  },
  {
    name: "Snow Aile",
    image: "http://cdn.grindtv.com/uploads/2015/02/shutterstock_242371765.jpg",
    description: "Snow and fire"
  },
  {
    name: "Sunset",
    image: "http://img1.sunset.timeinc.net/sites/default/files/styles/1000x1000/public/image/2016/06/main/fall-camping-best-campgrounds-organ-pipe-cactus-national-monument-twin-peaks-1115.jpg?itok=11Jc3bMf",
    description: "Sunset is awesome here"
  }
];

function seedDB(){
  // Remove eveything
  Campground.remove({},(err)=>{
      if(err) {
        console.log(err);
      }
      else {
        console.log("Removed everything");
      }
  });

  // Add new campgrounds
  data.forEach((singleData)=>{
    Campground.create(singleData, (err, campground)=>{
      if(err)
        console.log(err);
      else {
        Comment.create(
          {
            author: "Goku",
            text: "This is my first comment"
          }, function(err, comment){
          if(err)
            console.log(err);
          else {
            campground.comments.push(comment);
            campground.save();
          }
        });
      }
    });
  });

  //Add a few more comments
}

module.exports = seedDB;
