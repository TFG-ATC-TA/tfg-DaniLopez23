const Farm = require('../models/Farm');
const Board = require('../models/Board');

const getTopics = async () => {
  try {
    const farm = await Farm.findOne();
    if (!farm) {
      throw new Error('Farm not found');
    }
    const farmId = farm.farmId;

    const uniqueSensorTypes = await Board.aggregate([
      { $unwind: "$sensors" },
      { $group: { _id: "$sensors.type" } },
      { $project: { _id: 0, type: "$_id" } }
    ]);

    const topics = uniqueSensorTypes.map(sensor => `${farmId}/${sensor.type}`);

    return topics;
  } catch (error) {
    console.error(error);
    return [];
  }
};

module.exports = getTopics;