import api from "@/config/api";

export const getTanksByFarmId = async (id) => {
  try {
    const response = await api.get(`/farms/${id}/tanks/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Failed to fetch tank equipments: ${
          error.response.data.message || "Unknown server error"
        }`
      );
    } else if (error.request) {
      throw new Error("Network error: Unable to reach the server");
    }
    throw new Error(
      "An unexpected error occurred while fetching tank equipments"
    );
  }
};

export const getEquipmentById = async (id) => {
  try {
    const response = await api.get(`/equipments/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Failed to fetch equipment: ${
          error.response.data.message || "Unknown server error"
        }`
      );
    } else if (error.request) {
      throw new Error("Network error: Unable to reach the server");
    }
    throw new Error("An unexpected error occurred while fetching equipment");
  }
};
