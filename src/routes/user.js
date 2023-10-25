const express = require("express");
const { requireLogin } = require("../common-middleware");
const router = express.Router();
const { register, login, emailverify } = require("../controllers/user");
const { validateSignupResult, isRequestValidated, validateSigninResult } = require("../validators/auth");

router.post("/users/login", validateSigninResult, isRequestValidated, login);
router.post("/users/register", validateSignupResult, isRequestValidated, register);
router.post("/users/emailverify", emailverify);


module.exports = router;
