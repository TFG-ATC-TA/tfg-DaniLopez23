const Farm = require("../models/Farms");
const Board = require("../models/Board");
const Tank = require("../models/Tank");



const getTopics = async () => {
  try {
    const farm = await Farm.findOne({});
    if (!farm) {
      throw new Error("Farm not found");
    }
    const farmId = farm.idname;

    const uniqueSensorTypes = await Board.aggregate([
      { $unwind: "$sensors" },
      { $group: { _id: "$sensors.type" } },
      { $project: { _id: 0, type: "$_id" } },
    ]);

    const topics = uniqueSensorTypes.map(
      (sensor) => `${farmId}/${sensor.type}`
    );

    return topics;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getFarm = async () => {
  const farm = await Farm.find({}).populate({
    path: "tanks",
    populate: {
      path: "tankStations.board",
      model: "Board",
    },
  });
  return farm;
}

// Función para obtener el tankId usando un boardId
const getTankIdByBoardId = (boardId) => {
  
};



module.exports = { getTopics, getFarm, getTankIdByBoardId };
