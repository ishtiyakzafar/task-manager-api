const { check, validationResult } = require("express-validator");

exports.validateSignupResult = [
  check("fullName").notEmpty().withMessage("FullName is required!"),
  check("email").notEmpty().withMessage("Email is required!"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 character long!"),
];

exports.validateSigninResult = [
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 character long!"),
];

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};
