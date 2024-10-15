const Farm = require("../models/Farm");
const farmRouter = require("express").Router();
const Tank = require("../models/Tank");
const Board = require("../models/Board");

farmRouter.get("/", async (req, res) => {
  try {
    const farms = await Farm.find({}).populate({
      path: "tanks",
      populate: {
        path: "tankStations.board",
        model: "Board",
      },
    });
    console.log(farms);
    res.json(farms);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = farmRouter;
