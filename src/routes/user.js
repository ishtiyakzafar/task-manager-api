const express = require("express");
const { requireLogin } = require("../common-middleware");
const router = express.Router();
const { register, login } = require("../controllers/user");
const { validateSignupResult, isRequestValidated, validateSigninResult } = require("../validators/auth");

router.post("/users/login", validateSigninResult, isRequestValidated, login);
router.post("/users/register", validateSignupResult, isRequestValidated, register);

module.exports = router;
