//todo add controlers
const ListDAO = require("../dao/lists.dao");

exports.createListHandler = async (req, res, next) => {
  try {
    const data = await new ListDAO().createList(req.body, req.user.id);
    console.log(data);
    res.status(200).send({
      msg: `created list!`,
      payload: data,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ err: err.message });
  }
};

exports.getListsHandler = async (req, res, next) => {
  try {
    const data = await new ListDAO().getLists(req.user.id);
    res.status(200).send({
      msg: `got lists!`,
      payload: data,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ err: err.message });
  }
};
exports.getArchivedListsHandler = async (req, res, next) => {
  try {
    const data = await new ListDAO().getArchivedLists(req.user.id);
    res.status(200).send({
      msg: `got archived lists!`,
      payload: data,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ err: err.message });
  }
};

exports.getListHandler = async (req, res, next) => {
  try {
    const data = await new ListDAO().getList(req.params.id, req.user.id);
    res.status(200).send({
      msg: `got list!`,
      payload: data,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ err: err.message });
  }
};

exports.deleteListHandler = (req, res, next) => {
  try {
    new ListDAO().deleteList(req.params.id);
    res.status(200).send({
      msg: `List deleted`,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ err: err.message });
  }
};
exports.updateListHandler = async (req, res, next) => {
  try {
    const listId = req.params.id;
    const updateData = { ...req.body };

    delete updateData.creatorId;

    const updatedList = await new ListDAO().updateList(updateData, listId);

    if (!updatedList) {
      return res.status(404).json({ msg: "List not found" });
    }

    res.status(200).json({
      msg: "List updated",
      payload: updatedList,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ err: err.message });
  }
};

exports.getMembersHandler = async (req, res, next) => {
  try {
    const data = await new ListDAO().getMembers(req.params.id);
    res.status(200).send({
      msg: `got members!`,
      payload: data,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ err: err.message });
  }
};
