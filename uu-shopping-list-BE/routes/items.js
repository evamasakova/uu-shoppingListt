const express = require("express");
const router = express.Router({ mergeParams: true });
const { verifyToken } = require("../middleware/authMiddleware");
const {
  attachUserRole,
  loadList,
  requireOwner,
  requireMemberOrOwner,
} = require("../middleware/listRoles");
const {
  addItemValidator,
  checkItemValidator,
  uncheckItemValidator,
  deleteItemValidator,
  viewItemsValidator,
} = require("../validator/items");
const validateInput = require("../middleware/validateInput");

const {
  addItemHandler,
  checkItemHandler,
  uncheckItemHandler,
  deleteItemHandler,
  viewItemsHandler,
} = require("../controllers/items");
router.get(
  "/all/:id",
  verifyToken,
  loadList,
  attachUserRole,
  requireMemberOrOwner,
  viewItemsHandler
);
router.post(
  "/add/:id",
  verifyToken,
  loadList,
  attachUserRole,
  requireMemberOrOwner,
  addItemValidator,
  validateInput,
  addItemHandler
); //any user - add items to list
router.put(
  "/check/:id",
  verifyToken,
  loadList,
  attachUserRole,
  requireMemberOrOwner,
  checkItemValidator,
  validateInput,
  checkItemHandler
); //any user - check tem
router.put(
  "/uncheck/:id",
  verifyToken,
  loadList,
  attachUserRole,
  requireMemberOrOwner,
  uncheckItemValidator,
  validateInput,
  uncheckItemHandler
); //any user - uncheck item
router.delete(
  "/delete/:id",
  verifyToken,
  loadList,
  attachUserRole,
  requireMemberOrOwner,
  deleteItemValidator,
  validateInput,
  deleteItemHandler
); //any user - delete item

module.exports = router;
