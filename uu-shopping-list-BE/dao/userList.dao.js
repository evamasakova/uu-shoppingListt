/**
 * databazove operace
 */
const { default: mongoose } = require("mongoose");
const List = require("../models/lists");
const User = require("../models/users");

class UserListDAO {
  constructor() {
    this.model = User;
  }
  async listMembers(listId) {
    try {
      return await List.findById(listId).select("members");
    } catch (error) {
      console.log(error);
    }
  }
  async inviteMember(listId, email) {
    try {
      //invite member pres email
      const invitedUser = await User.findOne({ email });
      const list = await List.findById(listId);
      list.members.push({
        userId: invitedUser._id,
        role: "member",
      });
      const updatedList = await list.save();
      await User.findByIdAndUpdate(invitedUser._id, {
        $addToSet: { memberLists: list._id },
      });
      return updatedList;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async removeMember(listId, userId) {
    try {
      const updatedList = await List.findByIdAndUpdate(
        listId,
        { $pull: { members: { userID: userId } } },
        { new: true }
      );
      return updatedList;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async leaveList(listId, userId) {
    try {
      const updatedList = await List.findByIdAndUpdate(
        listId,
        { $pull: { members: { userID: userId } } },
        { new: true }
      );
      return updatedList;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
module.exports = UserListDAO;
