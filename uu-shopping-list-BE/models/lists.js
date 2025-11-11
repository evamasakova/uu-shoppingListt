const mongoose = require("mongoose");

const listSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },

  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      userID: {type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true},
      role: {type: String, required: true}
    },
  ],

  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
  ]
}, {timestamps: true} //mongoose se automaticky postará o createdAt a updatedAt
);

const List = mongoose.model("List", listSchema);
module.exports = List;
