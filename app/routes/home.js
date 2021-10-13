var express = require("express");
var User = require("../models/user");

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

            res.render("home");
        }

    });

});

router.post("/signin", function (req, res, next) {
   
   var email = req.body.email;
   var password = req.body.password;

   User.find({email: email}, function(err , data){
        if (err){
            res.render("signin");
        }
        else if (data[0] == null){
            res.render("signin");
        }
        else if (password != data[0].password){
            res.render("signin");
        }
        else if(password == data[0].password){
            res.render("home");
        }
   });

});

module.exports = router;