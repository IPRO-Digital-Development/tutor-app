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

var Promise = require("bluebird");
var fs = require("fs");
var path = require("path");

var Chat = require("./models/chat");
var Tutor = require("./models/tutors");

var marked = require("marked");
const http = require("http");
const server = http.createServer(app);

var { Server } = require("socket.io");
const io = new Server(server);

var bodyParser = require("body-parser");
const { time } = require("console");
const { render } = require("ejs");
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

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'", "notedwin.tech"],
        "frame-src": [
          "https://datastudio.google.com/embed/reporting/f6f80816-a403-4e41-9cef-59185f89973b/page/HDQ0B",
        ],
      },
    },
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public/css")); // used for assets such as pictures and css
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
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

app.get("/meet", async function (req, res) {
  uniq_majors = [];
  days = [];
  Tutor.distinct("major")
    .lean()
    .exec(function (err, docs) {
      for (let i = 0; i < docs.length; i++) {
        uniq_majors.push(docs[i]);
      }
    });

  Tutor.distinct("weekdays")
    .lean()
    .exec(function (err, docs) {
      for (let i = 0; i < docs.length; i++) {
        if (docs[i] === "MO") {
          days.push({ value: "Monday", short: docs[i] });
        }
        if (docs[i] === "TU") {
          days.push({ value: "Tuesday", short: docs[i] });
        }
        if (docs[i] === "WE") {
          days.push({ value: "Wednesday", short: docs[i] });
        }
        if (docs[i] === "TH") {
          days.push({ value: "Thursday", short: docs[i] });
        }
        if (docs[i] === "FR") {
          days.push({ value: "Friday", short: docs[i] });
        }
      }
    });
  await new Promise((resolve) => setTimeout(resolve, 500));
  res.render("meet", { majors: uniq_majors, weekdays: days });
});

app.post("/meet", async function (req, res) {
  var tutors = [];
  var major = req.body.major;
  var day = req.body.weekday;
  var time = parseInt(req.body.time);

  console.log(day,major,time)

  Tutor.find({
    major: major,
    weekdays: { $in: [day] },
    start_time: { $lt: time },
    end_time: { $gt: time },
  })
    .lean()
    .exec(function (err, docs) {
      for (let i = 0; i < docs.length; i++) {
        tutors.push(docs[i]);
      }
    });
  await new Promise((resolve) => setTimeout(resolve, 500));
  res.render("meet_result",{tutors:tutors})
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
