var compression = require("compression");
var net = require("net");
var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var mongoose = require("mongoose");
const process = require("process");
require("dotenv").config();
var path = require("path");
// database connector
//mongoose.connect('mongodb://localhost:27017/test');

var url = "mongodb+srv://tutoradm:admin123@cluster0.rubfi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

var app = express();
mongoose.connect(url, {useUnifiedTopology:true, useNewUrlParser:true},function(error){
  if(error) console.log(error);

  console.log("connection successful");

})

app.use(compression());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public')); // used for assets such as pictures and css

app.set("views", path.join(__dirname, "views")); // used for pages

app.use("/", require("./routes/web"));

//front-end 3000
app.listen(3000, () => {
  console.log(
    `Example app listening at http://localhost:3000`
  );
});
