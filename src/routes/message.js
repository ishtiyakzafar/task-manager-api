const express = require("express");
const { requireLogin } = require("../common-middleware");
const router = express.Router();
const { sendMessage, getMessage, deleteMessages } = require("../controllers/message");

router.post("/message/sendmessage", requireLogin, sendMessage);
router.post("/message/getmessage", requireLogin, getMessage);
router.delete("/message/delete/:id", requireLogin, deleteMessages);

module.exports = router;
