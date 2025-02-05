const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  role: {
    type: String,
    enum: ["Administrador", "Veterinario", "Industria", "Ganadero"],
    required: true,
  },
  farms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Farm" }],
});

UserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model("User", UserSchema);
