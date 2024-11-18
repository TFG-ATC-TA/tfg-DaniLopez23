const mongoose = require("mongoose");

const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["Tanque de leche", "Estación de lavado"],
    required: true,
  },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
  devices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Device" }],
  associatedTanks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
    },
  ],
});

EquipmentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Equipment", EquipmentSchema);

