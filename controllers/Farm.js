const Farm = require("../models/Farms");
const farmRouter = require("express").Router();
const farmService = require("../services/farmService");

farmRouter.get("/", async (req, res) => {
  try {
    const farms = await farmService.getFarm();
    res.json(farms);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

farmRouter.get("/:id", async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id).populate({ path: "equipments", populate: { path: "devices" } });
    if (!farm) {
      return res.status(404).send("Farm not found");
    }
    res.json(farm);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = farmRouter;
