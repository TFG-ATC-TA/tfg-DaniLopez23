const Farm = require("../models/Farms");
const Equipment = require("../models/Equipment");
const Device = require("../models/Device");
const User = require("../models/User");

const getFarms = async () => {
  const farms = await Farm.find({});
  return farms;
};

const getFarmById = async (id) => {
  const farm = await Farm.findById(id).populate({ path: "equipments", populate: { path: "devices" } });
  return farm;
};


module.exports = { getFarms, getFarmById };
