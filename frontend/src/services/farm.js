import api from "@/config/api";

export const getFarmById = async (id) => {
  try {
    const response = await api.get(`/farms/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Failed to fetch farm data: ${error.response.data.message || 'Unknown server error'}`);
    } else if (error.request) {
      throw new Error('Network error: Unable to reach the server');
    }
    throw new Error('An unexpected error occurred while fetching farm data');
  }
};

export const getFarms = async () => {
  try {
    const response = await api.get('/farms');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Failed to fetch farms: ${error.response.data.message || 'Unknown server error'}`);
    } else if (error.request) {
      throw new Error('Network error: Unable to reach the server');
    }
    throw new Error('An unexpected error occurred while fetching farms');
  }
}


export const getHistoricalData = async (filters) => {
  try {
    const response = await api.post('/historical-data', filters);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Failed to fetch historical data: ${error.response.data.message || 'Unknown server error'}`);
    } else if (error.request) {
      throw new Error('Network error: Unable to reach the server');
    }
    throw new Error('An unexpected error occurred while fetching historical data');
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