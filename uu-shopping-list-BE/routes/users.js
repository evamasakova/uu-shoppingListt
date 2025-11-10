const express = require("express");
const router = express.Router();

const {
  getMemberHandler,
  inviteMemberHandler,
  leaveMemberHandler,
  removeMemberHandler,
} = require("../controllers/items");

router.get("/:id", getMemberHandler); //list all members of shopping list (owner privilege)
router.get("/", inviteMemberHandler); //invite member (owner privilege)
router.put("/:id", leaveMemberHandler); //leave list (member privilege)
router.delete("/:id", removeMemberHandler); //remove member from list (owner privilege)

module.exports = router;
