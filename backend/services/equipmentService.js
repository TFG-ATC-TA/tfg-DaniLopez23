const Equipment = require("../models/Equipment");
const Device = require("../models/Device");

const getEquipments = async () => {
  const equipments = await Equipment.find({}).populate("devices");
  return equipments;
};

const getEquipmentById = async (id) => {
    console.log(id);
  const equipment = await Equipment.findById(id).populate("devices");
  return equipment;
}

module.exports = { getEquipments, getEquipmentById };
