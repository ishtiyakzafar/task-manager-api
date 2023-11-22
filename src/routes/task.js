const express = require("express");
const { requireLogin } = require("../common-middleware");
const router = express.Router();
const { createTask, taskList, updateTask, addComment, deleteComment, updateTaskState, deleteTask, filterTask } = require("../controllers/task");


router.post("/createtask", requireLogin, createTask);
router.post("/tasklist", requireLogin, taskList);
router.post("/updatetask", requireLogin, updateTask);
router.post("/addcomment", requireLogin, addComment);
router.post("/deletecomment", requireLogin, deleteComment);
router.post("/taskstate", requireLogin, updateTaskState);
router.delete("/deletetask/:id", requireLogin, deleteTask);
router.post("/filtertask", requireLogin, filterTask);

module.exports = router;
