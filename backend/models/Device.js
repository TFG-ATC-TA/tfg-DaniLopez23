const mongoose = require("mongoose");
// Esquema de Dispositivos
const DeviceSchema = new mongoose.Schema({
  boardId: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: [
      "Monitor de leche",
      "Monitor de tanque",
      "Monitor de estación de lavado",
    ],
    required: true,
  },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment",
    required: true,
  },
  description: { type: String },
  sensors: [
    {
      sensorId: { type: String, required: true, unique: true },
      name: { type: String },
      description: { type: String },
    },
  ],
});

DeviceSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Device", DeviceSchema);