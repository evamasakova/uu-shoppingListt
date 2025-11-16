const { body, param } = require("express-validator");

exports.addItemValidator = [
  body("name")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("List name is required")
    .isLength({ max: 100 })
    .withMessage("Name must be under 100 characters"),
  param("id")
    .exists()
    .withMessage("List ID is required")
    .isMongoId()
    .withMessage("Invalid listID format"),
  body("checked").isBoolean().withMessage("Must be a boolean true or false"),
  
];

exports.checkItemValidator = [
  param("id").isMongoId().withMessage("Invalid item ID"),
  body("checked").isBoolean().withMessage("Must be a boolean true or false"),
];
exports.uncheckItemValidator = [
  param("id").isMongoId().withMessage("Invalid item ID"),
  body("checked").isBoolean().withMessage("Must be a boolean true or false"),
];
exports.deleteItemValidator = [
  param("id").isMongoId().withMessage("Invalid item ID"),
];
