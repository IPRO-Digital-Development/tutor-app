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
const { query } = require("express");
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

  var query = {"major":major,"day":day,"time":time}

  Tutor.find({
    major: major,
    weekdays: { $in: [day] },
    start_time: { $lte: time },
    end_time: { $gte: time },
  })
    .lean()
    .exec(function (err, docs) {
      for (let i = 0; i < docs.length; i++) {
        tutors.push(docs[i]);
      }
    });
  await new Promise((resolve) => setTimeout(resolve, 500));
  res.render("meet_result",{tutors:tutors, query:query })
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});



//const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
}
