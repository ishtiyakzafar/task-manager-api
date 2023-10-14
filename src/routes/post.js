const express = require("express");
const { requireLogin } = require("../common-middleware");
const router = express.Router();
const {
    createPost,
    addComment,
    getPost,
    deletePost,
    updateComment,
    deleteComment,
} = require("../controllers/post");

router.post("/post/create", requireLogin, createPost);
router.post("/post/addcomment", requireLogin, addComment);
router.get("/post/:id", requireLogin, getPost);
router.delete("/post/:id", requireLogin, deletePost);
router.post("/post/updatecomment", requireLogin, updateComment);
router.post("/post/deletecomment", requireLogin, deleteComment);


module.exports = router;
