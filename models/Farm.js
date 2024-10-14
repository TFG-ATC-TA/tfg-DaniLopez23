const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema({
  farmId: {
    type: String,
    required: true,
  },
  farmName: {
    type: String,
    required: true,
  },
  farmLocation: {
    type: String,
    required: true,
  },
  tanks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tank",
    },
  ],
});

farmSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Farm", farmSchema);
