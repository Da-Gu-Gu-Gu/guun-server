const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(200).json("invalid user");
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_PASS, (err, payload) => {
    if (err) return res.status(200).json("invalid user");

    let { id } = payload;
    User.findById(id).then((user) => {
      console.log(user);
      req.user = user;
      next();
    });
  });
};
