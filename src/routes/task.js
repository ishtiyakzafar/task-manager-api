const express = require("express");
const { requireLogin, adminMiddleware, userMiddleware } = require("../common-middleware");
const router = express.Router();
const {
  createTask,
  taskHistory,
  todaySod,
  updateTask,
  addComment,
  deleteComment,
  updateTaskState,
  deleteTask,
  filterTask,
  getAllTasks,
  adminAddTask,
  addProjectName,
  getProjects,
  deleteProject,
  updateProject,
} = require("../controllers/task");

// USER ROUTES
router.post("/createtask", requireLogin, userMiddleware, createTask);
router.post("/taskhistory", requireLogin, userMiddleware, taskHistory);
router.post("/todaysod", requireLogin, userMiddleware, todaySod);
router.post("/updatetask", requireLogin, userMiddleware, updateTask);
router.post("/addcomment", requireLogin, userMiddleware, addComment);
router.post("/deletecomment", requireLogin, userMiddleware, deleteComment);
router.delete("/deletetask/:id", requireLogin, userMiddleware, deleteTask);
router.post("/filtertask", requireLogin, userMiddleware, filterTask);




// ADMIN ROUTES
router.post("/admin/task-all", requireLogin, adminMiddleware, getAllTasks);
router.post("/admin/add-task", requireLogin, adminMiddleware, adminAddTask);
router.post("/admin/add-projectname", requireLogin, adminMiddleware, addProjectName);
router.delete("/admin/delete-project/:id", requireLogin, adminMiddleware, deleteProject);
router.post("/admin/update-project", requireLogin, adminMiddleware, updateProject);


//COMMON ROUTES
router.get("/projects", requireLogin, getProjects);
router.post("/taskstate", requireLogin, updateTaskState);



module.exports = router;
