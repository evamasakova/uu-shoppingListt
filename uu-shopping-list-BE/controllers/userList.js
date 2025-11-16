const UserListDAO = require("../dao/userList.dao");

exports.inviteMemberHandler = async (req, res, next) => {
  try {
    
    const member = await new UserListDAO().inviteMember(
      req.body.userId,
      req.params.id
    );
    console.log(member)
    res.status(200).send({
      msg: `Invited member`,
      payload: member,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ err: err.message });
  }
};

exports.leaveMemberHandler = async (req, res, next) => {
  try {
    const member = await new UserListDAO().leaveList(req.params.id, req.body.userId);
    res.status(200).send({
      msg: `Member left`,
      payload: member,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ err: err.message });
  }
};
exports.removeMemberHandler = async(req, res, next) => {
  try {
    const member = await new UserListDAO().removeMember(req.params.id, req.body.userId);
    res.status(200).send({
      msg: `Removed member`,
      payload: member,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ err: err.message });
  }
};
