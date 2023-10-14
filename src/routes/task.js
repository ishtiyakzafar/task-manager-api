const express = require("express");
const { requireLogin } = require("../common-middleware");
const router = express.Router();
const { createTask, taskList, updateTask, deleteTask } = require("../controllers/task");


router.post("/createtask", requireLogin, createTask);
router.get("/tasklist", requireLogin, taskList);
router.post("/updatetask", requireLogin, updateTask);
router.delete("/deletetask/:id", requireLogin, deleteTask);

module.exports = router;
