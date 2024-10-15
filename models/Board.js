const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  boardId: {
    type: String,
    required: true,
  },
  sensors: [
    {
      sensorId: {
        type: String,
        required: true,
      },
      sensorType: {
        type: String,
        required: true,
      },
    },
  ],
});

boardSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Board", boardSchema);
