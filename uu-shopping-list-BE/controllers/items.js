const ItemDAO = require("../dao/items.dao");

exports.viewItemsHandler = async (req, res, next) => {
  try {
    const data = await new ItemDAO().viewItems(req.params.id);
    res.status(200).send({
      msg: ` got items!`,
      payload: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};
exports.addItemHandler = async (req, res, next) => {
  try {
    const data = await new ItemDAO().addItem(
      req.body,
      req.params.id,
      req.user.id
    );
    res.status(200).send({
      msg: `created Item!`,
      payload: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

exports.checkItemHandler = async (req, res, next) => {
  try {
    const data = await new ItemDAO().checkItem(req.body.itemId, req.params.id);
    
    res.status(200).send({
      msg: `checked Item!`,
      payload: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};
exports.uncheckItemHandler = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    const data = await new ItemDAO().uncheckItem(itemId, req.params.id);
    res.status(200).send({
      msg: `unchecked Item!`,
      payload: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

exports.deleteItemHandler = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    if (!itemId) return res.status(400).json({ error: "itemId is required" });
    const data = await new ItemDAO().deleteItem(itemId, req.params.id);
    console.log(data)
    
    res.status(200).json({
      msg: "Deleted item!",
      payload: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};
