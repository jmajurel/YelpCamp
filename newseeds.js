var mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment");

var data = [
  {
    name: "Canigou",
    image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg",
    desc: "Lovely place to camp"
  },
  {
    name: "Pic Saint-Loup",
    image: "https://farm8.staticflickr.com/7179/6927088769_cc14a7c68e.jpg",
    desc: "The view from the top of the montaine is very nice. Definitly to try"
  },
  {
    name: "Green Desert",
    image: "https://farm2.staticflickr.com/1076/826745086_e1c145c054.jpg",
    desc: "Do need for water in this desert, lovely landscape and flower everywhere"
  }
];

var sources = [
  {
    content: "I went there with my girlfriend we really enjoyed",
    author: "Anthony"
  },
  {
    content: "The fresh montain air is heatly",
    author: "Sarah"
  }
];

function seedDB() {
  Campground.remove({}, function(err){
    if(err) {
      console.log(err);
    } else {
      data.forEach(function(rawCamp){
	Campground.create(rawCamp, function(err, camp){
	  if(err){
	    console.log(err);
	  } else {
	    console.log("Added new camp: "+camp.name);
	    Comment.create({
	      content: "This is a comment",
	      author: "Michael"
	    }, function(err, com){
	      if(err){
	        console.log(err);
	      } else {
	        console.log("Added new comment in DB");
	        camp.comments.push(com._id);
	        camp.save();
	        console.log("Updated camp: "+camp.name);
	      } 
	    });
	  } 
	});
      });
    }
  });
};

module.exports = seedDB;
