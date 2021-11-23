var mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema({
  tutor_id: { type: String, required: true, unique: true },
  review: {type: Array, required: true}
});

var Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
