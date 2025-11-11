const UserListDAO = require("../dao/userList.dao");

exports.showListMembers = (req, res, next) => {
  const members = new UserListDAO().listMembers(req.params.id);
  res.status(200).send({
    msg: `Showing list ${req.params.id}`,
  });
};

exports.removeMember = (req, res, next) => {
  const member = new UserListDAO().removeMember(req.params.id, req.user.id);
  res.status(200).send({
    msg: `Showing list ${req.params.id}`,
  });
};
