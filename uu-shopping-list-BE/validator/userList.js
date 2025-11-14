const { body, param } = require("express-validator");
const List = require("../models/lists");

exports.inviteMemberValidator = [
  param("id").exists().isMongoId().withMessage("Invalid list ID"),
  body("userId")
    .exists()
    .isMongoId()
    .withMessage("Invalid user Id")
    .bail()
    .custom(async (value, { req }) => {
      const listId = req.params.id;
      const list = await List.findById(listId);
      if (!list) {
        throw new Error("List not found");
      }
      const alreadyMember = list.members.some(
        (m) => m.userId.toString() === value.toString()
      );
      if (alreadyMember) {
        throw new Error("User is already a member of this list");
      }
      return true;
    }),
];

exports.leaveMemberValidator = [
  param("id").exists().isMongoId().withMessage("Invalid list ID"),
  body("userId").exists().isMongoId().withMessage("Invalid user Id"),
];

exports.removeMemberValidator = [
  param("id").exists().isMongoId().withMessage("Invalid list ID"),
  body("userId").exists().isMongoId().withMessage("Invalid user Id"),
];
