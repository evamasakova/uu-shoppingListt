const ItemDAO = require("../dao/items.dao");

exports.addItemHandler = async (req, res, next) => {
  try {
    const data = await new ItemDAO().addItem(req.body);
    res.status(200).send({
      msg: `created Item!`,
      payload: data,
    });
  } catch (error) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

exports.checkItemHandler = async (req, res, next) => {
  try {
    const data = await new ItemDAO().checkItem(req.params.id);
    res.status(200).send({
      msg: `checked Item!`,
      payload: data,
    });
  } catch (error) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};
exports.uncheckItemHandler = async (req, res, next) => {
  try {
    const data = await new ItemDAO().uncheckItem(req.params.id);
    res.status(200).send({
      msg: `unchecked Item!`,
      payload: data,
    });
  } catch (error) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

exports.deleteItemHandler = async (req, res, next) => {
  try {
    const data = await new ItemDAO().deleteItem(req.params.id);
    res.status(200).send({
      msg: `deleted Item!`,
      payload: data,
    });
  } catch (error) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};
