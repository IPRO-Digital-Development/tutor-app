var compression = require("compression");
var express = require("express");
var app = express();
const process = require("process");
require("dotenv").config();
var path = require("path");
// database connector
const mongoose = require("mongoose");
var helmet = require("helmet");
var session = require("express-session");
var createError = require("http-errors");

var passport = require("passport");
var setUpPassport = require("./setuppassport");

var Promise = require("bluebird"); // Require 'bluebird' in your package.json file, and run npm install.
var fs = require("fs");
var path = require("path");

var Chat = require("./models/chat");

var marked = require("marked");
const http = require("http");
const server = http.createServer(app);

var { Server } = require("socket.io");
const io = new Server(server);

var bodyParser = require("body-parser"); //get data from web app
Promise.promisifyAll(fs);

setUpPassport();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => console.log(err));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'", "notedwin.tech"],
    },
  },
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public/css")); // used for assets such as pictures and css
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use(express.static(__dirname + "/public/images"));
app.set("views", path.join(__dirname, "./views")); // used for pages
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "tutorapp!@#$!@#",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", require("./routes"));

app.get("/wiki", function (req, res) {
  fs.readFileAsync(path.join(__dirname, "/markdown/wiki.md")).then(function (
    val
  ) {
    res.send(marked(val.toString()));
  });
});

app.get("/chat", function (req, res) {
  res.render("chat");
});

io.on("connection", (socket) => {
  Chat.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .then((result) => {
      for (let i = result.length - 1; i > -1; i--) {
        socket.emit("chat message", result[i]["message"]);
      }
    });

  socket.on("chat message", (msg) => {
    const message = new Chat({ message: msg });
    message.save().then(() => {
      io.emit("chat message", msg);
    });
  });
});

app.get("/edit", function (req, res) {
  res.render("edit");
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
