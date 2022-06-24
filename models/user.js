const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  meetingid: {
    type: Number,
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
