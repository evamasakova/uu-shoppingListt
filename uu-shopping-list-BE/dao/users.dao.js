const { default: mongoose } = require("mongoose");
const User = require("../models/users");

class UserDAO {
  constructor() {
    this.model = User;
  }
  async listMembers() {
    try {
      return await User.find().select("-__v");
    } catch (error) {
        console.log(error)
    }
  }
  async inviteMember(){
    try {
        //invite member pres email
    } catch (error) {
        
    }
  }
  async removeMember() {
    try {
        //owner validation
    } catch (error) {
        
    }
  }
  async leaveList() {
    try {
        //owner validation
    } catch (error) {
        
    }
  }
  
}
module.exports = UserDAO;