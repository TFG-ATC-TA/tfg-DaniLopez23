import axios from "axios";

const baseUrl = "http://localhost:3001/farms";

export const getFarm = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching farm data:", error);
    throw error; // Re-throw the error so it can be caught in the hook
  }
};

export const getBoardsByTank = (farmData) => {

  if (!farmData || !farmData.equipments || farmData.equipments.length === 0) {
    console.log("No equipment data found");
    return {};
  }

  const milkTanks = farmData.equipments.filter(
    (equipment) => equipment.type === "Tanque de leche"
  );
  
  const boardsByTank = milkTanks.reduce((acc, tank) => {
    if (tank.devices && Array.isArray(tank.devices)) {
      const boardIds = tank.devices.map((device) => device.boardId).filter(Boolean);
      if (boardIds.length > 0) {
        acc[tank._id] = boardIds;
      }
    }
    return acc;
  }, {});

  console.log("Boards by tank:", boardsByTank);
  return boardsByTank;
};

export const getHistoricalData = async (filters) => {
  try {
    console.log('Filters:', filters);

    const response = await axios.post('http://localhost:3001/historical-data', filters);
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered data:', error);
    throw error;
  }
};