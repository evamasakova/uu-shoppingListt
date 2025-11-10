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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],

  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
  ],

  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
}, {timestamps: true} //mongoose se automaticky postará 
);

const List = mongoose.model("List", listschema);
module.exports = List;
