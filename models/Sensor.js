const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  sensorID: {
    type: String,
    required: true,
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