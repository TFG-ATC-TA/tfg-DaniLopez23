const mongoose = require("mongoose");

const tankSchema = new mongoose.Schema({
  tankName: {
    type: String,
    required: true,
  },
  tankStations: [
    {
      name: {
        type: String,
      },
      board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
      },
    },
  ],
});

tankSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Tank", tankSchema);


