const express = require("express");
const { requireLogin } = require("../common-middleware");
const router = express.Router();
const {
    addContact,
    getContacts,
    addGroupContact,
    uploadGroupPhoto,
    removeGroupPhoto,
    updateGroupDescription,
    updateGroupParticipant,
} = require("../controllers/contact");

router.post("/contact/addcontact", requireLogin, addContact);
router.post("/contact/addgroupcontact", requireLogin, addGroupContact);
router.get("/contact/getcontact", requireLogin, getContacts);
router.put("/contact/group/groupPhoto", requireLogin, uploadGroupPhoto);
router.put("/contact/group/removePhoto", requireLogin, removeGroupPhoto);
router.put("/contact/group/groupdescription", requireLogin, updateGroupDescription);
router.put("/contact/group/updateparticipant", requireLogin, updateGroupParticipant);



module.exports = router;
