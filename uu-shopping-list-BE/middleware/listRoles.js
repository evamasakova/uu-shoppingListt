const List = require("../models/lists");

// Load list and attach role to req
exports.loadListAndRole = async (req, res, next) => {
  try {
    const listId = req.params.listId;
    const userId = req.user.id;
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ msg: "List not found" });

    // find user role
    const member = list.members.find(
      m => m.userId.toString() === userId
    );
    req.list = list;
    req.userRole = member ? member.role : null;
    next();
  } catch (err) {
    next(err);
  }
};
// Must be Owner
exports.requireOwner = (req, res, next) => {
  if (req.userRole !== "Owner") {
    return res.status(403).json({ msg: "Only Owner can perform this action" });
  }
  next();
};

// Must be Member or Owner
exports.requireMemberOrOwner = (req, res, next) => {
  if (req.userRole !== "Owner" && req.userRole !== "Member") {
    return res.status(403).json({ msg: "Forbidden — must be Member or Owner" });
  }
  next();
};
exports.requireMember = (req, res, next) => {
  if (req.userRole !== "Member" ) {
    return res.status(403).json({ msg: "Forbidden — must be Member" });
  }
  next();
};
