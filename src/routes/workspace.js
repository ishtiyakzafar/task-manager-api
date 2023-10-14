const express = require("express");
const { requireLogin } = require("../common-middleware");
const router = express.Router();
const {
    createWorkspace,
    getClassList,
    getWorkspace,
    deleteWorkspace,
    updateWorkspace,
} = require("../controllers/workspace");

router.post("/workspace/create", requireLogin, createWorkspace);
router.get("/workspace/class-list", requireLogin, getClassList);
router.get("/workspace/:id", requireLogin, getWorkspace);
router.delete("/workspace/:id", requireLogin, deleteWorkspace);
router.post("/workspace/updateworkspace", requireLogin, updateWorkspace);


module.exports = router;
