const express = require("express");
const router = express.Router();
const validateInput = require("../middleware/validateInput");
const {
  inviteMemberHandler,
  leaveMemberHandler,
  removeMemberHandler,
} = require("../controllers/userList");

const { removeMemberValidator,inviteMemberValidator , leaveMemberValidator} = require("../validator/userList");

router.post(
  "/invite/:id",inviteMemberValidator, validateInput, inviteMemberHandler
); //list id //invite member (owner privilege)
router.put("/leave/:id", leaveMemberValidator, validateInput, leaveMemberHandler); //leave list (member privilege)
router.delete("/remove/:id",removeMemberValidator, validateInput, removeMemberHandler); //remove member from list (owner privilege)

module.exports = router;
