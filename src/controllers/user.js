const User = require("../model/user");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");


//REGISTER USER
exports.register = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ message: "Email already exist, Try another" });
    const newUser = new User(req.body);
    await newUser.save();
    const { _id, role, email, fullName } = newUser;
    const token = jwt.sign({ _id, role }, "jdad4a#$@hsehfjdhf", { expiresIn: "1d" });
    return res.status(201).json({ token, _id, role, email, fullName });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};

//LOGIN USER
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (user.password === req.body.password) {
        const { _id, role, email, fullName } = user;
        const token = jwt.sign({ _id, role }, "jdad4a#$@hsehfjdhf", { expiresIn: "1d" });
        return res.status(200).json({ token, _id, role, email, fullName });
      } else {
        res.status(400).json({ message: "Incorrect email or password" });
      }
    } else {
      res.status(400).json({ message: "Incorrect email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};
