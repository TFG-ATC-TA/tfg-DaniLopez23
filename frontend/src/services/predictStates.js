import api from "@/config/api";

export const predictStatesByDate = async (filters) => {
  try {
    const response = await api.post("/predict", filters);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Failed to fetch predicted states: ${
          error.response.data.message || "Unknown server error"
        }`
      );
    } else if (error.request) {
      throw new Error("Network error: Unable to reach the server");
    }
    throw new Error(
      "An unexpected error occurred while fetching predicted states"
    );
  }
};

export const predictRealTimeStates = async (filters) => {
  try {
    const response = await api.post("/predict/real-time", filters);
    console.log("Response from predictRealTimeStates:", response.data);
    // Si el backend responde con data: null, lanza un error con el mensaje
    if (response.data && response.data.data === null) {
      throw new Error(response.data.message || "No hay datos suficientes para la predicción en tiempo real.");
    }

    return response.data;
  } catch (error) {

    if (error) {
      throw new Error(
        `${
          error || "Unknown server error"
        }`
      );
    } else if (error.request) {
      throw new Error("Network error: Unable to reach the server");
    }
    
    throw new Error(
      "An unexpected error occurred while fetching predicted states"
    );
  }
}
