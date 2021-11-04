const mongoose = require("mongoose");

var tutorSchema = new mongoose.Schema({
  major: { type: String, required: true },
  tutor: { type: String, required: true },
  start_time: { type: Number, required: true },
  end_time: { type: Number, required: true },
  weekdays: { type: Array, required: true },
});

let Tutor = mongoose.model("Tutor", tutorSchema);
module.exports = Tutor;
