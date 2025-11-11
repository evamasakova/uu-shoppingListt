/**
 * databazove operace
 */
const { default: mongoose } = require("mongoose");
const Item = require("../models/items");

class ItemDAO {
  constructor() {
    this.model = Item;
  }

  async addItem(data) {
    try {
      const foo = new Item({
        name: data.name,
        listID: data.listID,
        checked: false,
        addedBy: data.addedBy,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async checkItem(itemId) {
    try {
      return await Item.findByIdAndUpdate(
        itemId,
        { checked: false },
        { new: true }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async uncheckItem(itemId) {
    try {
      return await Item.findByIdAndUpdate(
        itemId,
        { checked: true },
        { new: false }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async deleteItem(itemId) {
    try {
      const deletedItem = await Item.findByIdAndDelete(itemId);
      return deletedItem;
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = ItemDAO;
