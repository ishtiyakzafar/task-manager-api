const express = require("express");
const { requireLogin } = require("../common-middleware");
const router = express.Router();
const {
    createClassroom,
    getClassroom,
    getClassroomById,
} = require("../controllers/classroom");

router.post("/classroom/join", requireLogin, createClassroom);
router.get("/classroom/all", requireLogin, getClassroom);
router.get("/classroom/:id", requireLogin, getClassroomById);


module.exports = router;
