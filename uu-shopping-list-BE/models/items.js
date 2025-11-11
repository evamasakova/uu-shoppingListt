const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
  name: { type: String, required: true },
  listID: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
  checked: { type: Boolean, required: true },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, {timestamps: true});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
