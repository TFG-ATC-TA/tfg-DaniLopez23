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
