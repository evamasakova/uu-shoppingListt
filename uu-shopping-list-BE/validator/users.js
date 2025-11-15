const { body, param } = require("express-validator");

exports.createUserValidator = [
  body("name")
    .exists()
    .withMessage("Firstname is required")
    .isString()
    .isLength({ max: 64 }),
  body("username")
    .exists()
    .bail()
    .trim()
    .isLength({ max: 100 })
    .isString()
    .withMessage("Something is not right with username"),
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("passwordHash")
    .exists()
    .withMessage("Password is required")
    .isString()
    .isLength({ min: 6 }),
  body("createdLists")
    .exists()
    .isArray()
    .optional()
    .withMessage("Something is not right with createdLists"),
  body("memberLists")
    .exists()
    .isArray()
    .optional()
    .withMessage("Something is not right with memberLists"),
];
