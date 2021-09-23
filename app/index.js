var compression = require("compression");
var net = require("net");
var express = require("express");
const process = require("process");
require("dotenv").config();
var path = require("path");
// database connector
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(mongoose.connection.readyState);

var app = express();
app.use(compression());
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public/css")); // used for assets such as pictures and css
app.use(express.static(__dirname + "/public/images"));
app.set("views", path.join(__dirname, "./views")); // used for pages

app.get("", function(req, res) {
  res.render("index");
});

//front-end 3000
app.listen(3001, () => {
  console.log(
    `Tutor app listening at http://localhost:3001`
  );
});
