var express = require("express");
var User = require("../models/user");
var Profile = require("../models/profile");
var Tutor = require("../models/tutors");
var Review = require("../models/review");
var passport = require("passport");
var tutorID;

var router = express.Router();

router.get("", function (req, res) {
  res.render("home");
});

router.get("/signin", function (req, res) {
  res.render("signin");
});

router.get("/signup", function (req, res) {
  res.render("signup");
});

router.get("/home", function (req, res) {
  res.render("home");
});

router.get("/chat", function (req, res) {
  res.render("chat");
});

router.get("/data", function (req, res) {
  res.render("data");
});

router.get("/cal", function (req, res) {
  res.render("cal");
});

router.post(
  "/signup",
  function (req, res, next) {
    var First_Name = req.body.First_Name;
    var Last_Name = req.body.Last_Name;
    var A_id = req.body.A_id;
    var email = req.body.email;
    var password = req.body.password;
    var repassword = req.body.repassword;
    var role = req.body.role;
    var major = req.body.major;
    var tutor;

    if (role == "Student"){
      tutor = false;
    }else{
      tutor = true;
    }

    if (password != repassword) {
      return res.redirect("signup");
    }

    User.find(
      { $or: [{ email: email }, { A_id: A_id }] },
      function (err, user) {
        if (err) {
          return res.redirect("signup");
        }
        if (user[0]) {
          return res.redirect("signup");
        }
        if (user[1]) {
          return res.redirect("signup");
        }
        if (!err) {
          if(tutor){
            var newTutor = new Tutor({
              major: major,
              tutor: First_Name + " " + Last_Name,
              start_time: 1000,
              end_time: 1400,
              A_id: A_id,
              weekdays: ["MO", "WE"]
            });
            newTutor.save();
            var newUser = new User({
              First_Name: First_Name,
              Last_Name: Last_Name,
              A_id: A_id,
              email: email,
              password: password,
              Tutor: tutor
            });
          }else{
            var newUser = new User({
              First_Name: First_Name,
              Last_Name: Last_Name,
              A_id: A_id,
              email: email,
              password: password,
              Tutor: tutor
            });
          }
          var newProfile = new Profile({
            A_id: A_id,
            email: email,
            major: major,
            interest: "",
            classes: "",
            availability: "",
            description: "",
          })
          newProfile.save();
          newUser.save(next);
        }
      }
    );
  },
  passport.authenticate("signup", {
    successRedirect: "home",
    failureRedirect: "signup",
    failureFlash: true,
  })
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

router.post(
  "/signin",
  passport.authenticate("signup", {
    successRedirect: "home",
    failureRedirect: "signin",
    failureFlash: true,
  })
);

router.get("/profile", function (req, res, next) {
  if (res.locals.currentUser == null) {
    res.render("signin");
  } else {
    Profile.findOne(
      { A_id: res.locals.currentUser.A_id },
      function (err, data) {
        if (err) {
          console.log("err");
        } 
        else {
          res.render("profile", { profData: data });
        }
      }
    );
  }
});

router.get("/profileEdit", function (req, res, next) {
  if (res.locals.currentUser == null) {
    res.render("signin");
  } else {
    Profile.findOne(
      { A_id: res.locals.currentUser.A_id },
      function (err, data) {
        if (err) {
          console.log("err");
        } else {
          res.render("profileEdit", { profData: data });
        }
      }
    );
  }
});

router.post("/saveEditProf", function (req, res, next) {
  var interestEd = req.body.Interest;
  var classesEd = req.body.Classes;
  var availabilityEd = req.body.Availability;
  var descriptionEd = req.body.Description;

  // var lines = descriptionEd.trim().split("\n");
  // console.log(lines);

  if (res.locals.currentUser == null) {
    res.render("signin");
  } else {
    Profile.findOneAndUpdate(
      { A_id: res.locals.currentUser.A_id },
      {
        $set: {
          interest: interestEd,
          classes: classesEd,
          availability: availabilityEd,
          description: descriptionEd,
        },
      },
      { returnOriginal: false },
      function (err, data) {
        if (err) {
          console.log("err");
        } else {
          res.render("profile", { profData: data });
        }
      }
    );
  }
});

router.get("/cancelEdit", function (req, res) {
  if (res.locals.currentUser == null) {
    res.render("signin");
  } else {
    Profile.findOne(
      { A_id: res.locals.currentUser.A_id },
      function (err, data) {
        if (err) {
          console.log("err");
        } else {
          res.render("profile", { profData: data });
        }
      }
    );
  }
});

router.post("/meet_result", function(req, res){
  tutorID = req.body.A_id;
})

router.get("/tutorProf", function(req, res){
  // var userData;
  // var userProf;
  console.log(tutorID)
  User.findOne({A_id:tutorID}, function(err, userdata){
    if(err){
      console.log("user not found");
    }
    else if (!err){
      // console.log(tutorID);
      Profile.findOne({A_id:tutorID}, function(err, data){
        if (err) {
          console.log("error");
        }else{
          Tutor.findOne({A_id:tutorID}, function(err, tdata){
            if(err){
              console.log("cant find tutor");
            }
            else{
              console.log("userdata " + userdata + "\n profData: " + tdata)
            res.render("tutorProf", { profData: data, tutorData: userdata, tutorMajor: tdata });
            }
          })
        }
      })
    }
  })
})

router.post("/review", function(req,res){
  tutorID = req.body.A_id;
})

router.get("/review", function(req, res, next){
  var rProfData;
  var rUserData;
  // console.log(tutorID)
  Tutor.findOne({A_id:tutorID}, function(err, pdata){
    if (err){
      console.log("cant find major")
    }else{
      rProfData = pdata
      User.findOne({A_id:tutorID}, function(err, tdata){
        if (err){
          console.log("cant find user");
        }
        else{
          rUserData = tdata
          Review.findOne({tutor_id:tutorID}, async function(err, rdata){
            if(err){
              console.log("cant find review")
            }
            else if (rdata == null) {
              await new Promise(r => setTimeout(r, 1000));
              var newReview = new Review({
                      tutor_id: tutorID,
                      review: [],
              })
              newReview.save(next)
              res.render("review", {review: newReview, profData: rProfData, tutorData: rUserData})
            } else if (rdata != null){
              res.render("review", {review: rdata, profData: rProfData, tutorData: rUserData})
            }
          })
        }
      })
    }
  })
})


router.post("/submit_review", function(req,res) {
  // console.log("tutor_id " + req.body.tutor_id + "\n review: " + req.body.review
  //             + "\n date: " + req.body.date + "\n scores: " + req.body.scores);  
  
  var review_json = {
    user_review: req.body.review,
    review_date: req.body.date,
    review_score: req.body.scores
  }

  // console.log(review_json);

  Review.updateOne({tutor_id:req.body.tutor_id}, {$push: 
    {review: 
      {$each: [review_json], $position: 0},
     }, returnOriginal: false}, function(err, data){
       if(err){
         console.log("review update error");
       }else{
         console.log(data);
       }
     })
})


module.exports = router;
