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
  // exampleMultiRoleHandler,
} = require("../controllers/lists");
/*
const auth = require("../middleware/authOwnerList");
const authMultiRole = require("../middleware/authMultiRole");
*/

router.post(
  "/create",
  verifyToken,
  createListValidator,
  validateInput,
  createListHandler
); //create list (any user)
router.get("/find/:id", getListValidator, validateInput, getListHandler); //any user who is a member of or is an owner of that list
router.get("/all", getListsHandler); // any user, as long as they own at least one or are a part of at least one
router.get("/archived", getArchivedListsHandler); // any user, as long as they own at least one or are a part of at least one
router.put("/update/:id", updateListValidator, validateInput, updateListHandler); // list-level update -> owners privilege, (changing names, removing members,...)
router.delete(
  "/delete/:id",
  /*auth,*/ deleteListValidator,
  validateInput,
  deleteListHandler
); //owner privileges
//potom .populate na jmena uzivatelu
router.get(
  "/members/:id",
  getMembersValidator,
  validateInput,
  getMembersHandler
);
//router.get("/:id", authMultiRole(["admin", "owner"]), exampleMultiRoleHandler)

module.exports = router;
