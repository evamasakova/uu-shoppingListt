const List = require("../models/lists");

const roles = {
  owner: "owner",
  member: "member",
};

// list
exports.loadList = async (req, res, next) => {
  try {
    const listId = req.params.id;
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ msg: "List not found" });

    req.list = list;
    next();
  } catch (err) {
    next(err);
  }
};

// role
exports.attachUserRole = (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.list) return res.status(500).json({ msg: "List not loaded" });

    const member = req.list.members.find((m) => m.userId.toString() === userId);

    req.userRole = member ? member.role : null;
    next();
  } catch (err) {
    next(err);
  }
};
// Must be Owner
exports.requireOwner = (req, res, next) => {
  if (req.userRole !== roles.owner) {
    return res.status(403).json({ msg: "Only Owner can perform this action" });
  }
  next();
};

// Must be Member or Owner
exports.requireMemberOrOwner = (req, res, next) => {
  if (req.userRole !== roles.owner && req.userRole !== roles.member) {
    return res.status(403).json({ msg: "Forbidden — must be Member or Owner" });
  }
  next();
};
exports.requireMember = (req, res, next) => {
  if (req.userRole !== roles.member) {
    return res.status(403).json({ msg: "Forbidden — must be Member" });
  }
  next();
};
