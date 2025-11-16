const express = require("express");
const router = express.Router();
const {
  loadList,
  attachUserRole,
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

router.get(
  "/find/:id",
  verifyToken,
  loadList,
  attachUserRole,
  requireMemberOrOwner,
  getListValidator,
  validateInput,
  getListHandler
); //any user who is a member of or is an owner of that list
router.get("/all", verifyToken, getListsHandler); // any user, as long as they own at least one or are a part of at least one
router.get(
  "/archived",
  verifyToken,
  loadList,
  attachUserRole,
  requireOwner,
  getArchivedListsHandler
); // owners

/**
 *
 * URL: /members/:id
 * Method: GET
 */
router.get(
  "/members/:id",
  verifyToken,
  loadList,
  attachUserRole,
  requireMemberOrOwner,
  getMembersValidator,
  validateInput,
  getMembersHandler
);
router.post(
  "/create-list",
  verifyToken,
  createListValidator,
  validateInput,
  createListHandler
); //create list (any user)
router.put(
  "/update/:id",
  verifyToken,
  loadList,
  attachUserRole,
  requireOwner,
  updateListValidator,
  validateInput,
  updateListHandler
); // list-level update -> owners privilege, (changing names, removing members,...)
router.delete(
  "/delete/:id",
  verifyToken,
  loadList,
  attachUserRole,
  requireOwner,
  deleteListValidator,
  validateInput,
  deleteListHandler
); //owner privileges

module.exports = router;
