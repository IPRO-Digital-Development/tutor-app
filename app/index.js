var compression = require("compression");
var net = require("net");
var express = require("express");
const process = require("process");
require("dotenv").config();
var path = require("path");
// database connector
const mongoose = require('mongoose');
var helmet = require('helmet')

var createError = require('http-errors');

var Promise = require('bluebird'); // Require 'bluebird' in your package.json file, and run npm install.
var fs = require('fs');
var path = require('path');
var marked = require('marked')
Promise.promisifyAll(fs);

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
//
//app.use('/', indexRouter);
//app.use('/users', usersRouter);



mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(mongoose.connection.readyState);

var app = express();
app.use(helmet())
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public/css")); // used for assets such as pictures and css
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.static(__dirname + "/public/images"));
app.set("views", path.join(__dirname, "./views")); // used for pages

app.get("", function(req, res) {
  res.render("index");
});

app.post("/", function(req, res) {
  res.send("Hello World");
});

app.get('/wiki', function (req, res) {
  fs.readFileAsync(path.join(__dirname, '/markdown/wiki.md')).then(function(val) {
    res.send(marked(val.toString()));
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//front-end 3000
app.listen(3001, () => {
  console.log(
    `Tutor app listening at http://localhost:3001`
  );
});
