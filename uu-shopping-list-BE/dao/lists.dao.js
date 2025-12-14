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

  async createList(data, userID) {
    try {
      const list = new List({
        archived: false,
        name: data.name,
        description: data.description,

        creatorId: userID,
        members: [
          {
            userId: userID,
            role: "owner",
          },
        ],

        items: [],
      });
      return await list.save();
    } catch (error) {
      console.log(error);
    }
  }
  async getList(listId, userID) {
    try {
      return await List.findOne({
        _id: listId,
        $or: [{ creatorId: userID }, { "members.userId": userID }],
      }).select("-__v");
    } catch (error) {
      console.log(error);
    }
  }

  async getLists(userID) {
    try {
      return await List.find({
        archived: false,
        $or: [{ creatorId: userID }, { "members.userId": userID }],
      })
        .populate("creatorId", "name email")
        .populate("members.userId", "name email")
        .select("-__v");
    } catch (error) {
      console.log(error);
    }
  }
  async updateList(data, listId) {
    try {
      const updatedList = await List.findByIdAndUpdate(listId, data, {
        new: true,
        runValidators: true,
      });

      return updatedList;
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }

  async getArchivedLists(userID) {
    try {
      return await List.find({
        archived: true,
        $or: [{ creatorId: userID }, { "members.userId": userID }],
      })
        .populate("creatorId", "name email")
        .populate("members.userId", "name email")
        .select("-__v");
    } catch (error) {
      console.log(error);
    }
  }

  async updateList(data, listId) {
    try {
      const updatedList = await List.findByIdAndUpdate(listId, data, {
        new: true,
      });

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
  async getMembers(id) {
    try {
      return await List.findById(id).select("members");
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = ListDAO;
