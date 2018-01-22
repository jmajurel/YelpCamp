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

function seed() {
  Campground.remove({}, function(err) {
    if(err) {
      console.log(err);
    } else {

      console.log("All data removed from DB");

      //Store all comments in db
      commentSeeds.forEach(function(comment) {
	Comment.create(comment, function(err){
	  if(err) {
	    console.log(err);
	  } else {
	    console.log("Comment has been saved in db"); 
	    //Store all campgrounds in db
	    campgroundSeeds.forEach(function(camp) {
	      Campground.create(camp, function(err){
		if(err) {
		  console.log(err);
		} else {
		  console.log("Camp has been saved in db"); 

		  //Link campgrounds to comments
		  Campground.find({}, function(err, campgrounds) {
		    if(err){
		      console.log(err);
		    } else {
		      Comment.find({}, function(err, comments) {
			if(err) {
			  console.log(err);
			} else {
			  campgrounds.forEach(function(camp){
			    comments.forEach(function(comment){
			      camp.comments.push(comment._id);
			    });
			    //Display campgrounds
			    console.log("=======================");
			    console.log("Display all campgrounds");
			    Campground.find({}, function(err, campgrounds) {
			      if(err) {
				console.log(err);
			      } else {
				console.log(campgrounds);
			      }
			    });
			    console.log("=======================");

			  });
			}
		      });
		    }
		  });

		}
	      });
	    });
	  }
	});
      });



    }
  }); 
}

seed();

//module.exports = seed
