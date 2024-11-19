const Farm = require("../models/Farms");
const Equipment = require("../models/Equipment");
const Device = require("../models/Device");
const User = require("../models/User");
// const getTopics = async () => {
//   try {
//     const farm = await Farm.findOne({});
//     if (!farm) {
//       throw new Error("Farm not found");
//     }
//     const farmId = farm.idname;

//     const uniqueSensorTypes = await Board.aggregate([
//       { $unwind: "$sensors" },
//       { $group: { _id: "$sensors.type" } },
//       { $project: { _id: 0, type: "$_id" } },
//     ]);

//     const topics = uniqueSensorTypes.map(
//       (sensor) => `${farmId}/${sensor.type}`
//     );

//     return topics;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// };

const getFarm = async () => {
  const farms = await Farm.findOne({}).populate({ path: "equipments", populate: { path: "devices" } });
  return farms;
};

module.exports = { getFarm };
