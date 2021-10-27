var mongoose = require("mongoose");

var profileSchema = new mongoose.Schema({
    A_id:{type:String, required:true, unique: true},
    email:{type:String, required:true, unique: true},
    major:{type:String, required:false},
    interest:{type:String, required:false},
    classes:{type:String, required:false},
    availability:{type:String, required:false},
    description:{type:String, required:false}
});


var Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;