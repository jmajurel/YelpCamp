var mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment");

var data = [
  {
    name: "Canigou",
    image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg",
    desc: "Seventeen thousand! Those guys must really be desperate. This could really save my neck. Get back to the ship and get her ready. You'll have to sell your speeder. That's okay. I'm never coming back to this planet again. Going somewhere, Solo? Yes, Greedo. As a matter of fact, I was just going to see your boss. Tell Jabba that I've got his money. It's too late. You should have paid him when you had the chance. Jabba's put a price on your head, so large that every bounty hunter in the galaxy will be looking for you. I'm lucky I found you first. Yeah, but this time I got the money. If you give it to me, I might forget I found you. I don't have it with me. Tell Jabba... And what of the Rebellion? If the Rebels have obtained a complete technical readout of this station, it is possible, however unlikely, that they might find a weakness and exploit it. The plans you refer to will soon be back in our hands. Any attack made by the Rebels against this station would be a useless gesture, no matter what technical data they've obtained. This station is now the ultimate power in the universe. I suggest we use it!"
  },
  {
    name: "Pic Saint-Loup",
    image: "https://farm8.staticflickr.com/7179/6927088769_cc14a7c68e.jpg",
    desc: "Seventeen thousand! Those guys must really be desperate. This could really save my neck. Get back to the ship and get her ready. You'll have to sell your speeder. That's okay. I'm never coming back to this planet again. Going somewhere, Solo? Yes, Greedo. As a matter of fact, I was just going to see your boss. Tell Jabba that I've got his money. It's too late. You should have paid him when you had the chance. Jabba's put a price on your head, so large that every bounty hunter in the galaxy will be looking for you. I'm lucky I found you first. Yeah, but this time I got the money. If you give it to me, I might forget I found you. I don't have it with me. Tell Jabba... And what of the Rebellion? If the Rebels have obtained a complete technical readout of this station, it is possible, however unlikely, that they might find a weakness and exploit it. The plans you refer to will soon be back in our hands. Any attack made by the Rebels against this station would be a useless gesture, no matter what technical data they've obtained. This station is now the ultimate power in the universe. I suggest we use it!"
  },
  {
    name: "Green Desert",
    image: "https://farm2.staticflickr.com/1076/826745086_e1c145c054.jpg",
    desc: "Seventeen thousand! Those guys must really be desperate. This could really save my neck. Get back to the ship and get her ready. You'll have to sell your speeder. That's okay. I'm never coming back to this planet again. Going somewhere, Solo? Yes, Greedo. As a matter of fact, I was just going to see your boss. Tell Jabba that I've got his money. It's too late. You should have paid him when you had the chance. Jabba's put a price on your head, so large that every bounty hunter in the galaxy will be looking for you. I'm lucky I found you first. Yeah, but this time I got the money. If you give it to me, I might forget I found you. I don't have it with me. Tell Jabba... And what of the Rebellion? If the Rebels have obtained a complete technical readout of this station, it is possible, however unlikely, that they might find a weakness and exploit it. The plans you refer to will soon be back in our hands. Any attack made by the Rebels against this station would be a useless gesture, no matter what technical data they've obtained. This station is now the ultimate power in the universe. I suggest we use it!"
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
 /*     data.forEach(function(rawCamp){
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
      });*/
    }
  });
};

module.exports = seedDB;
