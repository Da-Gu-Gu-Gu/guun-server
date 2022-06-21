const jwt = require("jsonwebtoken");

export const userAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(200).json("invalid user");
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWTPASS, (err, payload) => {
    if (err) return res.status(200).json("invalid user");

    let { email } = payload;
    User.findOne({ email: email }).then((user) => {
      console.log(user);
      req.user = user;
      next();
    });
  });
};
