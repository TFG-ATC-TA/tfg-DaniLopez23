const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  sensorId: {
    type: String,
    required: true,
  },
  sensorType: {
    type: String,
    required: true,
  },
  sensorValue: {
    type: Number,
    required: false,
  },
  sensorUnit: {
    type: String,
    required: false,
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
  },
});

sensorSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Sensor", sensorSchema);
