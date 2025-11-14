const express = require("express");
const router = express.Router({ mergeParams: true });

const {addItemValidator,checkItemValidator,uncheckItemValidator,deleteItemValidator} = require("../validator/items")
const validateInput = require("../middleware/validateInput")


const {
  addItemHandler,
  checkItemHandler,
  uncheckItemHandler,
  deleteItemHandler,
} = require("../controllers/items");

router.post("/add", addItemValidator, validateInput, addItemHandler); //any user - add items to list
router.put("/check/:id",checkItemValidator, validateInput, checkItemHandler); //any user - check tem
router.put("/uncheck/:id", uncheckItemValidator, validateInput,uncheckItemHandler); //any user - uncheck item
router.delete("/delete/:id", deleteItemValidator, validateInput, deleteItemHandler); //any user - delete item

module.exports = router;
