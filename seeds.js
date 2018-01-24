var mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment");

mongoose.connect('mongodb://localhost/yelpCamp');

var campgroundSeeds = [
  {
    name: "Pic Saint-Loup",
    image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
    desc: "Lovely french landscape",
  },
  {
    name: "Salagou",
    image: "https://farm5.staticflickr.com/4108/5007720401_558aae8ebd.jpg",
    desc: "Salagou lake is famous for this red ground"
  },
  {
    name: "4000 marches",
    image: "https://farm5.staticflickr.com/4100/4798314980_bc31231984.jpg",
    desc: "Perfect for hiking, good level mandory"
  }
];

var commentSeeds = [
  {
    content: "Very nice area, perfect for hiking",
    author: "Cindy"
  },
  {
    content: "I got bit by mosquitoes, take with you some spray",
    author: "Marc"
  }
];

function seedDB() {

  console.log("resetDB middleware function called");
  Campground.remove({}, function(err) {
    if(err) {
      console.log(err);
    } else {
      Comment.remove({}, function(err) {
	if(err) {
	  console.log(err);
	} else {
	  console.log("The DB has been reset"); 

	  console.log("storeComments middleware function called");
	  commentSeeds.forEach(function(com) {
	    Comment.create(com, function(err) {
	      if(err) {
		console.log(err);
	      } 
	    });
	  });

	  console.log("storeCampgrounds middleware function called");
	  campgroundSeeds.forEach(function(camp) {
	    Campground.create(camp, function(err) {
	      if(err) {
	       	console.log(err);
	      } else {
		console.log(camp)

	      }
	    });
	  });
          console.log("All camps stored in the DB");
        }
     });
    }
  });
};

module.exports = seedDB;
