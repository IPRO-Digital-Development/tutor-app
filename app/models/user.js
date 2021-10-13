var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    First_Name:{type:String, required:true},
    Last_Name:{type:String, required:true},
    A_id:{type:String, required:true, unique: true},
    email:{type:String, required:true, unique: true},
    password:{type:String, required:true}
});

var User = mongoose.model("User", userSchema);

module.exports = User;