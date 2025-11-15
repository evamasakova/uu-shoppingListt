const express = require("express");
const router = express.Router();
const validateInput = require("../middleware/validateInput");
const { login } = require("../middleware/authMiddleware");

const { verifyToken } = require("../middleware/authMiddleware");

const {
  loadListAndRole,
  requireOwner,
  requireMemberOrOwner,
  requireMember,
} = require("../middleware/listRoles");
//members
const {
  inviteMemberHandler,
  leaveMemberHandler,
  removeMemberHandler,
} = require("../controllers/userList");
const {
  removeMemberValidator,
  inviteMemberValidator,
  leaveMemberValidator,
} = require("../validator/userList");
//users
const { createUserHandler, loginUserHandler } = require("../controllers/users");
const { createUserValidator } = require("../validator/users");

//members
router.post(
  "/members/invite/:id",
  verifyToken,
  loadListAndRole,
  requireOwner,
  inviteMemberValidator,
  validateInput,
  inviteMemberHandler
); //list id //invite member (owner privilege)
router.put(
  "/members/leave/:id",
  verifyToken,
  loadListAndRole,
  requireMember,
  leaveMemberValidator,
  validateInput,
  leaveMemberHandler
); //leave list (member privilege)
router.delete(
  "/members/remove/:id",
  verifyToken,
  loadListAndRole,
  requireOwner,
  removeMemberValidator,
  validateInput,
  removeMemberHandler
); //remove member from list (owner privilege)

//users

router.post(
  "/create-user",
  createUserValidator,
  validateInput,
  createUserHandler
);
router.post("/login", login, loginUserHandler);

module.exports = router;
