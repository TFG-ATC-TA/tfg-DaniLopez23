const Farm = require("../models/Farm");
const farmRouter = require("express").Router();
const Tank = require("../models/Tank");
const Board = require("../models/Board");
const farmService = require("../services/farmService");

farmRouter.get("/", async (req, res) => {
  try {
    const farms = farmService.getFarm();
    console.log(farms);
    res.json(farms);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = farmRouter;
