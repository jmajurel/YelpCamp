var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    location: String,
    lat: Number,
    lng: Number,
    image: String,
    desc: String,
    author: {
      id: {
	type: mongoose.Schema.Types.ObjectId,
	ref: "User"
      },
      username: String
    },
    comments: [
      {
	type: mongoose.Schema.Types.ObjectId,
	ref: "Comment"
      }
    ]
});

module.exports = mongoose.model('Campground', campgroundSchema);

