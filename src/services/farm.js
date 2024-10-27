import axios from "axios";

const baseUrl = "http://localhost:3001/farms";

export const getFarm = async () => {
  try {
    const response = await axios.get(baseUrl);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
