/**
 * input validation
 */
const { body, param } = require("express-validator");

exports.createListValidator = [
  //archived
  body("archived").isBoolean().withMessage("Must be a boolean true or false"),
  //name
  body("name")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("List name is required")
    .isLength({ max: 100 })
    .withMessage("Name must be under 100 characters"),
  //description
  body("description")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Description must be under 500 characters"),

  body("creatorId")
    .notEmpty()
    .withMessage("Creator ID is required")
    .isMongoId()
    .withMessage("Invalid creatorId format"),
  // members must be an array
  body("members")
    .isArray({ min: 1 })
    .withMessage("Members array must have at least one member (owner)"),

  // each member userId must be valid ObjectId
  body("members.*.userId")
    .isMongoId()
    .withMessage("Invalid member userId format"),

  // each member role must be a string
  body("members.*.role").isString().withMessage("Member role must be a string"),

  // items must be an array (can be empty)
  body("items").isArray().withMessage("Items must be an array"),

  // no invalid ObjectIds in items
  body("items.itemId")
    .optional()
    .isMongoId()
    .withMessage("Invalid item ID in items array"),
];
exports.getListValidator = [
  param("id").isMongoId().withMessage("Invalid list ID"),
];

exports.createListValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("List name is required")
    .isLength({ max: 100 })
    .withMessage("Name must be under 100 characters"),

  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be under 500 characters"),
];

exports.updateListValidator = [
  param("id").isMongoId().withMessage("Invalid list ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Name must be under 100 characters"),

  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be under 500 characters"),

  body("members.*.userId")
    .isMongoId()
    .withMessage("Invalid member userId format"),

  body("items").isArray().withMessage("Items must be an array"),
];

exports.deleteListValidator = [
  param("id").isMongoId().withMessage("Invalid list ID"),
];

exports.getMembersValidator = [
  param("id").isMongoId().withMessage("Invalid list ID"),
];
