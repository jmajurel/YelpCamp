var express = require('express');
var app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  var campgrounds = [
    { name: "Praloup", image: "http://www.photosforclass.com/download/15989950903" },
    { name: "Canigou", image: "http://www.photosforclass.com/download/1430198323" },
    { name: "Saint Victoire", image: "http://www.photosforclass.com/download/3662521481" },
  ];
  res.render('campgrounds', {campgrounds: campgrounds});
});

app.listen(3000, () => {
  console.log("Yelp Camp App is running on port 3000");
});
