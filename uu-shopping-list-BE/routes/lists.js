const express = require("express");
const router = express.Router();

const {
  createListValidator,
  getListValidator,
  updateListValidator,
  deleteListValidator,
} = require("../validator/lists");
const validateInput = require("../middleware/validateInput");

const {
  createListHandler,
  getListHandler,
  getListsHandler,
  updateListHandler,
  deleteListHandler,
// exampleMultiRoleHandler,
} = require("../controllers/lists");
/*
const auth = require("../middleware/authOwnerList");
const authMultiRole = require("../middleware/authMultiRole");
*/

//GET MEMBERS PRIDAT
router.post("/create", createListValidator, validateInput, createListHandler); //create list (any user)
router.get("/:id", getListValidator, validateInput, getListHandler); //any user who is a member of or is an owner of that list
router.get("/", getListsHandler); // any user, as long as they own at least one or are a part of at least one
router.put("/:id", updateListValidator, validateInput, updateListHandler); // list-level update -> owners privilege, (changing names, removing members,...)
router.delete("/:id", /*auth,*/ deleteListValidator, validateInput, deleteListHandler); //owner privileges

//router.get("/:id", authMultiRole(["admin", "owner"]), exampleMultiRoleHandler)
router.get('/:id', async (req, res) => {
  console.log("route param:", req.params);

});

module.exports = router;
