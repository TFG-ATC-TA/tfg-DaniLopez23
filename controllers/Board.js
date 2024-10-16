const Board = require("../models/Board");
const Farm = require("../models/Farm");
const boardRouter = require("express").Router();


boardRouter.get("/", async (req, res) => {
  const boards = await Board.find({});
  console.log(boards);
  res.json(boards);
});

boardRouter.get("/topics", async (req, res) => {
  
  const farm = await Farm.findOne({});

  const uniqueSensorTypes = await Board.aggregate([
    { $unwind: "$sensors" },
    { $group: { _id: "$sensors.type" } },
    { $project: { _id: 0, type: "$_id" } }
  ]);

  const sensorTypesList = uniqueSensorTypes.map(sensor => `${farm.farmId}/${sensor.type}`);
  
  res.json(sensorTypesList);
});

module.exports = boardRouter;