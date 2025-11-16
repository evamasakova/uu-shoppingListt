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

  /**
   * TODO: dodelat populate u memberu
   * @param {*} data
   * @param {*} listId
   * @returns
   */
  async inviteMember(userID, listId) {
    try {
      const user = await User.findById(userID).select("email _id");
      const list = await List.findById(listId);
      const alreadyMember = list.members.some(
        (m) => m.userId.toString() === user._id.toString()
      );
      if (alreadyMember) {
        return {
          message: "User is already a member of this list",
          listId: list._id,
          userId: user._id,
          email: user.email,
        };
      }

      const newMember = {
        userId: user._id,
        role: "member",
      };

      list.members.push(newMember);
      await list.save();

      return {
        listId: list._id,
        userId: user._id,
        email: user.email,
        role: "member",
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
        { $pull: { members: { userId: userId } } },
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
        { $pull: { members: { userId: userId } } },
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
