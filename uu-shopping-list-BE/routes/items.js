const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  addItemHandler,
  checkItemHandler,
  uncheckItemHandler,
  deleteItemHandler,
} = require("../controllers/items");

router.post("/", addItemHandler); //any user - add items to list
router.put("/:itemId/check", checkItemHandler); //any user - check tem
router.put("/:itemId/uncheck", uncheckItemHandler); //any user - uncheck item
router.delete("/:itemId", deleteItemHandler); //any user - delete item

module.exports = router;
