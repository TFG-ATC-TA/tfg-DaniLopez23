const mongoose = require("mongoose");
// Esquema de Recogidas
const CollectionSchema = new mongoose.Schema({
    collectionDate: { type: Date },
    cisternLicensePlate: { type: String },
    collectionCompany: { type: String },
    driver: { type: String },
    tankId: { type: String },
    sampleLabel: { type: String, required: true, unique: true },
    milkTemperature: { type: Number },
    inhibitorSampleTaken: { type: Boolean },
    litersPerTank: [
      {
        tankId: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment" },
        liters: { type: Number },
        compartment: { type: String },
      },
    ],
    sample: { type: mongoose.Schema.Types.ObjectId, ref: "Sample" },
  });

  CollectionSchema.set("toJSON", {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  });

  module.exports = mongoose.model("Collection", CollectionSchema);