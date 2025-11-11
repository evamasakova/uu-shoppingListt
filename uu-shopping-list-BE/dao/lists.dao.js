/**
 * databazove operace
 */

const { default: mongoose } = require("mongoose");
const List = require("../models/lists");
const User = require("../models/users");
const Item = require("../models/items");
class ListDAO {
  constructor() {
    this.model = List;
  }

  async createList(data) {
    try {
      const foo = new List({
        name: data.name,
        description: data.description,

        creatorId: data.creatorId,
        members: [
          {
            userId: data.creatorId,
            role: "owner",
          },
        ],

        items: [],

        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getList(listId) {
    try {
      const list = await List.findById(listId).select("-__v");
      return list;
    } catch (error) {
      console.log(error);
    }
  }
  async getLists() {
    try {
      return await Task.find().select("-__v");
    } catch (error) {
      console.log(error);
    }
  }
  async updateList(data, listId) {
    try {
      const updatedList = await List.findByIdAndUpdate(
        listId,
        { ...data, updatedAt: new Date() },
        { new: true }
      );
      return updatedList;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteList(listId) {
    try {
      //delete references of list for createdLists
      await User.updateMany(
        { createdLists: listId },
        { $pull: { createdLists: listId } }
      );
      //delete references of list for memberLists
      await User.updateMany(
        { memberLists: listId },
        { $pull: { memberLists: listId } }
      );
      await Item.deleteMany({ listID: listId });

      const deletedList = await List.findByIdAndDelete(listId);
      return deletedList;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
module.exports = ListDAO;
