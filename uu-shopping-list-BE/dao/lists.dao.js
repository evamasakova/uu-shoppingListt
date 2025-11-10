//create
//get list
//get lists
//update
//delete

const { default: mongoose } = require("mongoose");
const List = require("../models/lists");

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
  async getList() {
    try {
      return await List.find().select("-__v");
    } catch (error) {
      console.log(error);
    }
  }
  async getLists() {
    try {
    } catch (error) {
      console.log(error);
    }
  }
  async removeMember() {
    try {
      //owner validation
    } catch (error) {
      console.log(error);
    }
  }
  async leaveList() {
    try {
      //owner validation
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = ListDAO;
