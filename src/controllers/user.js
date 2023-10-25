const { emailVerification } = require("../helpers");
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
    emailVerification(fullName, email, token)

    // return res.status(201).json({ token, _id, role, email, fullName });
    return res.status(201).json({ message: `You have successfully sign up to Task Manager! Please check ${email} to activate your account.` });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};

//LOGIN USER
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (!user.accountVerified) return res.status(400).json({ message: "Your account is not verified! Please check your email for verification." });
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

exports.emailverify = async (req, res) => {
  try {
    const userData = jwt.verify(req.body.token, 'jdad4a#$@hsehfjdhf');
    const user = await User.findById(userData._id);
    if (user.accountVerified) return res.status(200).json({ alreadyActive: true, message: 'Account already active' });
    const result = await User.findByIdAndUpdate(user._id, { accountVerified: true }, { new: true });
    return res.status(200).json({
      alreadyActive: false,
      message: "Thank you, your email has been verified. Your account is active. You can login now to access your account.",
      email: result.email,
      fullName: result.fullName
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
}
