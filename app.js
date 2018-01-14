var express    = require('express'),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/yelpCamp', { useMongoClient: true });

var campgroundSchema = mongoose.Schema(
  {
    name: String,
    image: String
  }
);
var Campgrounds = mongoose.model('campground', campgroundSchema);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds/new', (req, res) => {
  res.render('newCamp');
});

app.get('/campgrounds', (req, res) => {
  Campgrounds.find(function(err, data) {
    if(err) {
      console.log(err);
    } else {
      res.render('campgrounds', {campgrounds: data});
    }
  });
});

app.post('/campgrounds', (req, res) => {
  var newCampground = new Campgrounds({
    name: req.body.name,
    image: req.body.image
  });

  newCampground.save(function(err, data) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

app.listen(3000, () => {
  console.log("Yelp Camp App is running on port 3000");
});
