/**
 * databazove operace
 */
const { default: mongoose } = require("mongoose");
const Item = require("../models/items");
const List = require("../models/lists");
class ItemDAO {
  constructor() {
    this.model = Item;
  }
  /**
   * todo: populate na itemy
   * @param {*} listID
   * @returns
   */
  async viewItems(listID) {
    try {
      return await List.findById(listID).select("items").populate({
        path: "items",
        model: "Item",
        select: "-__v", // optional
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addItem(data, listID, userID) {
    try {
      const newItem = await Item.create({
        name: data.name,
        listID: listID,
        checked: false,
        addedBy: userID,
      });

      await List.findByIdAndUpdate(
        listID,
        { $push: { items: { itemId: newItem._id } } },
        { new: true }
      );

      return newItem; 
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async checkItem(itemId, listID) {
    try {
      const list = await List.findById(listID);

      const updatedItems = await Item.findByIdAndUpdate(
        itemId,
        { checked: true },
        { new: true }
      );
      list.items.push(updatedItems);
      return await list.save();
    } catch (error) {
      console.log(error);
    }
  }

  async uncheckItem(itemId, listID) {
    try {
      const list = await List.findById(listID);
      const updatedItems = await Item.findByIdAndUpdate(
        itemId,
        { checked: false },
        { new: true }
      );
      list.items.push(updatedItems);
      return await list.save();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteItem(itemId, listID) {
    try {
      const updatedList = await List.findByIdAndUpdate(
        listID,
        { $pull: { items: { itemId: itemId } } },
        { new: true }
      );
      return updatedList;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
module.exports = ItemDAO;
