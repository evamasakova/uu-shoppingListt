const express = require("express");
const router = express.Router();

const {
  createListHandler,
  getListHandler,
  getListsHandler,
  updateListHandler,
  deleteListHandler,
  exampleMultiRoleHandler
} = require("../controllers/lists");

const auth = require("../middleware/authOwnerList");
const authMultiRole = require("../middleware/authMultiRole");

//router.post("/create", createListHandler); //create list (any user)
//router.get("/:id", getListHandler); //any user who is a member of or is an owner of that list
//router.get("/", getListsHandler); // any user, as long as they own at least one or are a part of at least one
//router.put("/:id", updateListHandler); // list-level update -> owners privilege, (changing names, removing members,...)
router.delete("/:id", auth, deleteListHandler); //owner privileges
router.get("/:id", authMultiRole(["admin", "owner"]), exampleMultiRoleHandler)

module.exports = router;
