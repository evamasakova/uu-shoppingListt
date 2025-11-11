//todo add controlers
const ListDAO = require("../dao/lists.dao");

exports.deleteListHandler = (req, res, next) => {
  new ListDAO().deleteList(req.params.id);
  //1. smazat - jen pro ukázku
  let token = res.locals.mreraser;

  res.status(200).send({
    msg: `List deleted by ${token}`,
  });
};
//example multi role
exports.exampleMultiRoleHandler = (req, res, next) => {
  res.status(200).send({
    msg: `Showing list ${req.params.id}`,
  });
};
