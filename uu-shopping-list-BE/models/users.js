const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  createdLists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
  ],
  memberLists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true, //tohle neznamena ze pole musi mit alespon jednu polozku, znamena ze kazda polezka musi byt valid objectID tudiz pole muze byt prazdne
    },
  ],
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

const User = mongoose.model("User", userschema);
module.exports = User;
