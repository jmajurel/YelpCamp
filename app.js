var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var campgrounds = [
    { name: "Praloup", image: "http://www.photosforclass.com/download/15989950903" },
    { name: "Canigou", image: "http://www.photosforclass.com/download/1430198323" },
    { name: "Saint Victoire", image: "http://www.photosforclass.com/download/3662521481" },
    { name: "Praloup", image: "http://www.photosforclass.com/download/15989950903" },
    { name: "Canigou", image: "http://www.photosforclass.com/download/1430198323" },
    { name: "Saint Victoire", image: "http://www.photosforclass.com/download/3662521481" },
    { name: "Praloup", image: "http://www.photosforclass.com/download/15989950903" },
    { name: "Canigou", image: "http://www.photosforclass.com/download/1430198323" },
    { name: "Saint Victoire", image: "http://www.photosforclass.com/download/3662521481" }
];

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
  res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds', (req, res) => {
  var newCampground = {name: req.body.name, image: req.body.image}; 
  campgrounds.push(newCampground);
  res.redirect('/campgrounds');
});

app.listen(3000, () => {
  console.log("Yelp Camp App is running on port 3000");
});
