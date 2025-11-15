//todo add controlers
const ListDAO = require("../dao/lists.dao");

exports.createListHandler = (req, res, next) => {
  try {
    new ListDAO().createList(req.body);
    res.status(200).send({
      msg: `created list!`,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ err: err.message });
  }
};

exports.getListsHandler = async (req, res, next) => {
  try {
    const data = await new ListDAO().getLists();
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
    const data = await new ListDAO().getArchivedLists(req.body.archived);
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
    const data = await new ListDAO().getList(req.params.id);
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
exports.updateListHandler = (req, res, next) => {
  try {
    new ListDAO().updateList(req.body,req.params.id);
    res.status(200).send({
      msg: `List updated`,
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
