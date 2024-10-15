const Farm = require("../models/Farm");
const farmRouter = require("express").Router();

farmRouter.get("/", async (req, res) => {
  const farms = await Farm.find({}).populate("tanks");
  console.log(farms);
  res.json(farms);
});

module.exports = farmRouter;
