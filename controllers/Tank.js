const Tank = require("../models/Tank");
const tankRouter = require("express").Router();
const Board = require("../models/Board");

tankRouter.get("/", async (req, res) => {
  const tanks = await Tank.find({}).populate("tankStations.board")
  console.log(tanks);
  res.json(tanks);
});

module.exports = tankRouter;   