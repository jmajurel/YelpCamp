var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    seeds      = require("./seeds");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost/yelpCamp');

seeds();

app.get('/', (req, res) => {
  res.render('landing');
});

//INDEX
app.get('/campgrounds', function(req, res) {
  Campground.find(function(err, data) {
    if(err) {
      console.log(err);
    } else {
      res.render('index', {campgrounds: data});
    }
  });
});

app.post('/campgrounds', function(req, res) {

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

//CREATE
app.get('/campgrounds/new', (req, res) => {
  res.render('newCamp');
});

//SHOW
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id, function(err, foundItem){
    if(err) {
      console.log(err);
    } else {
      res.render('show', {campground: foundItem});
    }
  });
});

app.listen(3000, () => {
  console.log("Yelp Camp App is running on port 3000");
});
