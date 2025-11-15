const express = require("express");
const router = express.Router();
const {
  loadListAndRole,
  requireOwner,
  requireMemberOrOwner,
  requireMember,
} = require("../middleware/listRoles");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  createListValidator,
  getListValidator,
  updateListValidator,
  deleteListValidator,
  getMembersValidator,
} = require("../validator/lists");
const validateInput = require("../middleware/validateInput");

const {
  createListHandler,
  getListHandler,
  getListsHandler,
  updateListHandler,
  deleteListHandler,
  getMembersHandler,
  getArchivedListsHandler,
} = require("../controllers/lists");

router.post(
  "/create",
  verifyToken,
  createListValidator,
  validateInput,
  createListHandler
); //create list (any user)
router.get(
  "/find/:id",
  verifyToken,
  loadListAndRole,
  requireMemberOrOwner,
  getListValidator,
  validateInput,
  getListHandler
); //any user who is a member of or is an owner of that list
router.get("/all", verifyToken, getListsHandler); // any user, as long as they own at least one or are a part of at least one
router.get(
  "/archived",
  verifyToken,
  loadListAndRole,
  requireOwner,
  getArchivedListsHandler
); // owners
router.put(
  "/update/:id",
  verifyToken,
  loadListAndRole,
  requireOwner,
  updateListValidator,
  validateInput,
  updateListHandler
); // list-level update -> owners privilege, (changing names, removing members,...)
router.delete(
  "/delete/:id",
  verifyToken,
  loadListAndRole,
  requireOwner,
  deleteListValidator,
  validateInput,
  deleteListHandler
); //owner privileges
//potom .populate na jmena uzivatelu
router.get(
  "/members/:id",
  verifyToken,
  loadListAndRole,
  requireMemberOrOwner,
  getMembersValidator,
  validateInput,
  getMembersHandler
);
//router.get("/:id", authMultiRole(["admin", "owner"]), exampleMultiRoleHandler)

module.exports = router;
