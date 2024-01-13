const jwt = require("jsonwebtoken");

exports.requireLogin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, 'jdad4a#$@hsehfjdhf');
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Authorization Required' });
  }
};

exports.userMiddleware = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(400).json({ message: "User Access Denied" });
  }
  next();
};

exports.adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(400).json({ message: "Admin Access Denied" });
  }
  next();
};
