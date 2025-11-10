const express = require("express");
const router = express.Router();

const {
  createListHandler,
  getListHandler,
  getListsHandler,
  updateListHandler,
  deleteListHandler,
} = require("../controllers/items");

router.post("/create", createListHandler); //create list (any user)
router.get("/:id", getListHandler); //any user who is a member of or is an owner of that list
router.get("/", getListsHandler); // any user, as long as they own at least one or are a part of at least one
router.put("/:id", updateListHandler); // list-level update -> owners privilege, (changing names, removing members,...)
router.delete("/:id", deleteListHandler); //owner privileges

module.exports = router;
