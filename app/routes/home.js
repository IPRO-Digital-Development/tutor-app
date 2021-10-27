var express = require("express");
var User = require("../models/user");
var Profile = require("../models/profile");
var passport = require("passport");

var router = express.Router();

router.get("", function (req, res) {
    res.render("index");
});

router.get("/signin", function (req, res) {
    res.render("signin")
});

router.get("/signup", function (req, res) {
    res.render("signup")
 });

router.get("/home", function (req, res) {
   res.render("index");
});

router.post("/signup", function (req, res, next) {

    var First_Name = req.body.First_Name;
    var Last_Name = req.body.Last_Name;
    var A_id = req.body.A_id;
    var email = req.body.email;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if(password != repassword){
        return res.redirect("signup");
    }

    User.find({$or: [{email: email},{A_id : A_id}]}, function (err, user) {
        if (err) {
            return res.redirect("signup");
        }
        if (user[0]){
            return res.redirect("signup");
        }
        if (user[1]){
            return res.redirect("signup");
        }
        if(!err){
            console.log("6");
            var newUser = new User({
                First_Name: First_Name,
                Last_Name: Last_Name,
                A_id: A_id,
                email: email,
                password: password
            });
    
            newUser.save(next);
        }

    });

}, passport.authenticate("signup", {
    successRedirect: "home",
    failureRedirect: "signup",
    failureFlash: true
 }));

 router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
 });

router.post("/signin", passport.authenticate("signup", {
    successRedirect: "home",
    failureRedirect: "signin",
    failureFlash: true
}));

router.get("/profile", function (req, res, next) {
    if(res.locals.currentUser == null) {
        res.render("signin");
    } else {
        Profile.findOne({A_id: res.locals.currentUser.A_id}, function(err, data){
            if(err){
                console.log("err")
            }
            else if(data == null){
                var NewProf = new Profile({
                    A_id: res.locals.currentUser.A_id,
                    email: res.locals.currentUser.email,
                    major: "",
                    interest: "",
                    classes: "",
                    availability: "",
                    description: ""
                })
                NewProf.save(next);
                res.render("profile", {profData: NewProf});
            }
            else{
                res.render("profile", {profData: data});
            }
        });
    }
});


router.get("/profileEdit", function (req, res, next) {
    if(res.locals.currentUser == null) {
        res.render("signin");
    }
    else{
        Profile.findOne({A_id: res.locals.currentUser.A_id},function(err, data){
            if(err){
                console.log("err")
            }
            else{
                res.render("profileEdit", {profData: data});
            }
        });
    }
});

router.post("/saveEditProf", function (req, res, next){
    var majorEd = req.body.Major;
    var interestEd = req.body.Interest;
    var classesEd = req.body.Classes;
    var availabilityEd = req.body.Availability;
    var descriptionEd = req.body.Description;


    var lines = descriptionEd.trim().split("\n");
    console.log(lines);

    if(res.locals.currentUser == null) {
        res.render("signin");
    }
    else{
        Profile.findOneAndUpdate({A_id: res.locals.currentUser.A_id}, 
            {$set: {major: majorEd, interest: interestEd, classes: classesEd, availability: availabilityEd, description: descriptionEd}},
            {returnOriginal: false}, function(err, data){
                if(err){
                    console.log("err");
                }
                else{
                    res.render("profile", {profData: data})
                }
            });    
    }

});

router.get("/cancelEdit", function (req, res){

    if(res.locals.currentUser == null) {
        res.render("signin");
    }
    else{
        Profile.findOne({A_id: res.locals.currentUser.A_id}, function(err, data){
            if(err){
                console.log("err");
            }
            else{
                res.render("profile", {profData: data});
            }
        });
    }
});


module.exports = router;