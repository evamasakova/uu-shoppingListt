const express = require("express");
const router = express.Router({ mergeParams: true });
const { verifyToken } = require("../middleware/authMiddleware");
const {
  loadListAndRole,
  requireOwner,
  requireMemberOrOwner,
} = require("../middleware/listRoles");
const {
  addItemValidator,
  checkItemValidator,
  uncheckItemValidator,
  deleteItemValidator,
} = require("../validator/items");
const validateInput = require("../middleware/validateInput");

const {
  addItemHandler,
  checkItemHandler,
  uncheckItemHandler,
  deleteItemHandler,
} = require("../controllers/items");

router.post(
  "/add",
  verifyToken,
  loadListAndRole,
  requireMemberOrOwner,
  addItemValidator,
  validateInput,
  addItemHandler
); //any user - add items to list
router.put(
  "/check/:id",
  verifyToken,
  loadListAndRole,
  requireMemberOrOwner,
  checkItemValidator,
  validateInput,
  checkItemHandler
); //any user - check tem
router.put(
  "/uncheck/:id",
  verifyToken,
  loadListAndRole,
  requireMemberOrOwner,
  uncheckItemValidator,
  validateInput,
  uncheckItemHandler
); //any user - uncheck item
router.delete(
  "/delete/:id",
  verifyToken,
  loadListAndRole,
  requireMemberOrOwner,
  deleteItemValidator,
  validateInput,
  deleteItemHandler
); //any user - delete item

module.exports = router;
