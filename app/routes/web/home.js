var express = require("express");
var User = require("../../models/user");

var router = express.Router();

router.get("/", function (req, res) {
   res.render("main/");
});

router.get("/login", function (req, res) {
   res.render("main/login")
});

router.get("/home", function (req, res) {
   res.render("main/index");
});

router.get("/register", function (req, res) {
   res.render("main/register");
});

router.get("/login", function(req, res){
   res.render("main/register");
});


router.post("/register", function (req, res, next) {

   var First_Name = req.body.First_Name;
   var Last_Name = req.body.Last_Name;
   var A_id = req.body.A_id;
   var email = req.body.email;
   var password = req.body.password;
   var repassword = req.body.repassword;

   if(password != repassword){
      return res.redirect("/register");
   }

   User.find({$or: [{email: email},{A_id : A_id}]}, function (err, user) {
      if (err) {
         console.log("1");
         return next(err); 
      }
      if (user[0]){
         console.log("2");
      }
      if (user[1]){
         console.log("3");
      }

      var newUser = new User({
         First_Name: First_Name,
         Last_Name: Last_Name,
         A_id: A_id,
         email: email,
         password: password
      });

      newUser.save(next);

   });
   
   res.render("main/success");

});

router.post("/login", function (req, res, next) {
   
   var email = req.body.email;
   var password = req.body.password;

   User.find({email: email}, function(err , data){
      // console.log(data[0].password + " ");
      if (password != data[0].password){
         res.render("main/login")
      }
      else if(password == data[0].password){
         res.render("main/success")
      }
   });

});

module.exports = router;