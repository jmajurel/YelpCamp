var express = require("express");
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require('geocoder');
var sanitizer = require('sanitizer');

var router = express.Router();

//INDEX
router.get('/', function(req, res) {
  Campground.find(function(err, data) {
    if(err || !data) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: data, page: "campgrounds"});
    }
  });
});

//CREATE
router.post('/', middleware.isLoggedIn, function(req, res) {

  var newCampground = new Campground({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    desc: sanitizer.sanitize(req.body.description)
  });

  var CampgroundAuthor = {
    id: req.user._id,
    username: req.user.username
  };
  newCampground.author = CampgroundAuthor;
  geocoder.geocode(req.body.location, function(err, data){
    if(err || !data.results[0]){
      req.flash("error", "Cannot find Campground location");
      res.redirect("back");
    } else {

      newCampground.location = data.results[0].formatted_address;
      newCampground.lat = data.results[0].geometry.location.lat;
      newCampground.lng = data.results[0].geometry.location.lng;
      newCampground.save(function(err) {
	if(err) {
	  req.flash("error", "Something went wrong");
	  console.log(err);
	  res.redirect('/campgrounds');
	} else {
	  res.redirect('/campgrounds');
	}
      });
    }
  });
});

//NEW
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new', { page: "campgrounds" });
});

//SHOW
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundItem){
    if(err || !foundItem) {
      console.log(err);
    } else {
      res.render('campgrounds/show', { campground: foundItem, page: "campgrounds" });
    }
  });
});

//EDIT
router.get('/:id/edit', middleware.isLoggedIn, middleware.checkCampOwnership, (req, res) => {
  Campground.findById(req.params.id, function(err, foundItem){
    if(err || !foundItem){
      console.log(err);
      res.redirect("back");
    } else {
      res.render('campgrounds/edit', { campground: foundItem, page: "campgrounds" }); 
    }
  });
});

//UPDATE
router.put('/:id', middleware.isLoggedIn, middleware.checkCampOwnership, (req, res) => {

  req.body.campground.desc = sanitizer.sanitize(req.body.campground.desc);
  geocoder.geocode(req.body.campground.location, function(err, geoData){
    if(err || !geoData.results[0]) {
      req.flash("error", "Cannot find Campground location");
      res.redirect("back");
    } else {
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, camp) {
	if(err || !camp){
	  console.log(err);
	  res.redirect("back");
	} else {
	  camp.createdAt = new Date;
          camp.location = geoData.results[0].formatted_address;
	  camp.lat = geoData.results[0].geometry.location.lat;
	  camp.lng = geoData.results[0].geometry.location.lng;
	  camp.save();
	  res.redirect("/campgrounds/" + req.params.id);
	}
      });
    }
  });
});

//DESTROY
router.delete('/:id', middleware.isLoggedIn, middleware.checkCampOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
