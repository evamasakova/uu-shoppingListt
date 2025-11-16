const mongoose = require("mongoose");

const listSchema = mongoose.Schema(
  {
    archived: { type: Boolean, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },

    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        _id: false,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: { type: String, required: true },
      },
    ],
    items: [
      {
       _id:false,
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
      },
    ],
  },
  { timestamps: true } //mongoose se automaticky postará o createdAt a updatedAt
);

const List = mongoose.model("List", listSchema);
module.exports = List;
