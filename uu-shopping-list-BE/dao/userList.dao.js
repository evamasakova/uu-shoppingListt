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

  /*
  async inviteMember(data, listID) {
    try {
      //invite member pres email
      const invitedUser = await User.findOne(data);
      const list = await List.findById(listID);
      list.members.push({
        userId: invitedUser._id,
        role: "member",
      });
      const updatedList = await list.save();
      await User.findByIdAndUpdate(invitedUser._id, {
        $addToSet: { memberLists: list.id },
      });
      return updatedList;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }*/
  async inviteMember(data, listId) {
    try {
      const { id } = data;
      const user = await User.findOne({ id });
      const list = await List.findById(listId);
      const newMember = {
        userId: user._id,
        role: "member",
      };
      list.members.push(newMember);
      await list.save();
      return {
        listId: list._id,
        ...newMember,
      };
    } catch (error) {
      console.error(error);
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
      console.log("leaveList called with:", listId, userId);

      const updatedList = await List.findByIdAndUpdate(
        listId,
        { $pull: { members: { userId: userId } } }, // <-- ONLY the userId
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
