import axios from "axios";

const API_URL = "http://127.0.0.1:8000/farms";

export const createFarm = async (farmData) => {
  const response = await axios.post(
    API_URL,
    farmData
  );

  return response.data;
};