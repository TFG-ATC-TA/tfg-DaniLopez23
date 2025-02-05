const Farm = require("../models/Farms");
const Equipment = require("../models/Equipment");
const Device = require("../models/Device");
const User = require("../models/User");
const { get } = require("mongoose");

const getFarms = async () => {
  const farms = await Farm.find({}).populate({ path: "equipments", populate: { path: "devices" } });
  return farms;
};

const getFarmById = async (id) => {
  const farm = await Farm.findById(id).populate({ path: "equipments", populate: { path: "devices" } });
  return farm;
};

const getTanksByFarmId = async (id) => {
  console.log(id);
  const farm = await Farm.findById(id).populate({ path: "equipments", populate: { path: "devices" } });
  const tanks = farm.equipments.filter((equipment) => equipment.type === "Tanque de leche");
  return tanks;
}



module.exports = { getFarms, getFarmById, getTanksByFarmId };
