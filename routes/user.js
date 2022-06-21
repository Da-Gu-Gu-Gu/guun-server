const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    let usercheck = await User.findOne({ email: req.body.email });
    if (usercheck) {
      return res.status(200).json("User Already Exist");
    } else {
      let user = new User({
        name: req.body.displayName,
        email: req.body.email,
        profile: req.body.photoURL,
      });
      await user.save();
      return res.status(200).json("Account Created Successfully");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/signin", async (req, res) => {
  try {
    let usercheck = await User.findOne({ email: req.body.email });
    if (usercheck) {
      return res.status(200).json("Successfully login");
    } else {
      return res.status(200).json("user not found");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
