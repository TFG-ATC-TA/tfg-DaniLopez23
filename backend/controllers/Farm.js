const farmRouter = require("express").Router();
const farmService = require("../services/farmService");

farmRouter.get("/", async (req, res) => {
  try {
    const farms = await farmService.getFarms();
    res.json(farms);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

farmRouter.get("/:id", async (req, res) => {
  try {
    const farm = await farmService.getFarmById(req.params.id);
    if (!farm) {
      return res.status(404).send("Farm not found");
    }
    res.json(farm);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

farmRouter.get("/:id/tanks", async (req, res) => {
  try {
    console.log(req.query.id);
    const tanks = await farmService.getTanksByFarmId(req.params.id);
    res.json(tanks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = farmRouter;
