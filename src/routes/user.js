const express = require("express");
const { requireLogin, adminMiddleware } = require("../common-middleware");
const router = express.Router();
const { register, login, emailverify, getAllUsers, updateUserStatus } = require("../controllers/user");
const { validateSignupResult, isRequestValidated, validateSigninResult } = require("../validators/auth");

router.post("/users/login", validateSigninResult, isRequestValidated, login);
router.post("/users/register", validateSignupResult, isRequestValidated, register);
router.post("/users/emailverify", emailverify);


// ADMIN ROUTES
router.get("/admin/user-all", requireLogin, adminMiddleware, getAllUsers);
router.post("/admin/user-status", requireLogin, adminMiddleware, updateUserStatus);


module.exports = router;
