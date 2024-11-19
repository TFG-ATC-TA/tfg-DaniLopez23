const mongoose = require("mongoose");

const FarmSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  idname: { type: String, unique: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  equipments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipment" }],
});

FarmSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Farm", FarmSchema);
