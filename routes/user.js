const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userAuth = require("../middleware/Auth");

router.post("/", async (req, res) => {
  try {
    let usercheck = await User.findOne({ email: req.body.email });
    if (usercheck) {
      return res.status(200).json({ err: "User Already Exist" });
    } else {
      let user = new User({
        name: req.body.displayName,
        email: req.body.email,
        profile: req.body.photoURL,
        meetingid: Number(Date.now().toString().slice(-9)),
      });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_PASS);
      return res.status(200).json({ token: token, user: user });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    let usercheck = await User.findOne({ email: req.body.email });
    if (usercheck) {
      const token = jwt.sign({ id: usercheck._id }, process.env.JWT_PASS);
      return res.status(200).json({ token: token, user: usercheck });
    } else {
      return res.status(200).json("user not found");
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/update", userAuth, async (req, res) => {
  try {
    let userUpdate = await User.findOneAndUpdate(
      { email: req.user.email },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json("update successfully");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
