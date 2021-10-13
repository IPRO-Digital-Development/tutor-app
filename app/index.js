var compression = require("compression");
var express = require("express");
var app = express();
const process = require("process");
require("dotenv").config();
var path = require("path");
// database connector
const mongoose = require("mongoose");
var helmet = require("helmet");

var createError = require("http-errors");

var Promise = require("bluebird"); // Require 'bluebird' in your package.json file, and run npm install.
var fs = require("fs");
var path = require("path");


var marked = require("marked");
const http = require("http");
const server = http.createServer(app);

var { Server } = require("socket.io");
const io = new Server(server);

var bodyParser = require("body-parser"); //get data from web app
Promise.promisifyAll(fs);

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
//
//app.use('/', indexRouter);
//app.use('/users', usersRouter);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(mongoose.connection.readyState);

//app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public/css")); // used for assets such as pictures and css
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use(express.static(__dirname + "/public/images"));
app.set("views", path.join(__dirname, "./views")); // used for pages
app.use(bodyParser.urlencoded({extended:true}));


app.use("/", require("./routes"));

app.get("/wiki", function (req, res) {
  fs.readFileAsync(path.join(__dirname, "/markdown/wiki.md")).then(function (
    val
  ) {
    res.send(marked(val.toString()));
  });
});

app.get("/signin", function (req, res) {
  res.render("signin");
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});


app.get("/chat", function (req, res) {
  res.render("chat");
});


// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
  
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


//front-end 3000

server.listen(3001, () => {
  console.log("listening on *:3000");
});
