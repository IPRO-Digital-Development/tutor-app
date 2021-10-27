const mongoose = require("mongoose");

var chatSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

let Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
