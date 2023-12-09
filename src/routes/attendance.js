const express = require("express");
const { requireLogin, userMiddleware } = require("../common-middleware");

const router = express.Router();
const {
  createAttendance,
  getAttendance,
  updateAttendance,
  userAttendance,
} = require("../controllers/attendance");

router.post("/attendance", requireLogin, userMiddleware, createAttendance);
router.get("/attendance", requireLogin, userMiddleware, getAttendance);
router.put("/attendance", requireLogin, userMiddleware, updateAttendance);
router.post("/attendance/user", requireLogin, userMiddleware, userAttendance);


module.exports = router;
