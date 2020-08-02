const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }
  let valid;
  try {
    valid = jwt.verify(token, process.env.TOKEN);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!valid) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.userId = valid.userId;
  next();
};
