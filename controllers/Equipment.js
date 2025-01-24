const equipmentRouter = require("express").Router();
const equipmentService = require("../services/equipmentService");

equipmentRouter.get("/", async (req, res) => {
  try {
    const equipments = await equipmentService.getEquipments();
    res.json(equipments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

equipmentRouter.get("/:id", async (req, res) => {
  try {
    const equipment = await equipmentService.getEquipmentById(req.params.id);
    if (!equipment) {
      return res.status(404).send("Equipment not found");
    }
    res.json(equipment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = equipmentRouter;
