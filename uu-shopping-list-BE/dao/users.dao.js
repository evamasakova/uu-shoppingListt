const User = require("../models/users");

class UserDAO {
  constructor() {
    this.model = User;
  }
  
  async findUserByEmail(email) {
    try {
      return User.findOne({ email });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async createUser(userData) {
    try {
      return User.create(userData);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
module.exports = UserDAO;
