var express = require("express");
var Campground = require("../models/campground");
var router = express.Router();

//INDEX
router.get('/', function(req, res) {
  Campground.find(function(err, data) {
    if(err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: data});
    }
  });
});

//CREATE
router.post('/', function(req, res) {

  var newCampground = new Campground({
    name: req.body.name,
    image: req.body.image,
    desc: req.body.description
  });

  newCampground.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

//NEW
router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

//SHOW
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundItem){
    if(err) {
      console.log(err);
    } else {
      res.render('campgrounds/show', {campground: foundItem});
    }
  });
});

module.exports = router;
