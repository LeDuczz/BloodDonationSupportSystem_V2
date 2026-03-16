import axios from "../config/axios";

export const getCurrentUser = async () => {
  try {
    const response = await axios.get("/profile");
    return response.data;
  } catch (error) {
    console.error("Error getCurrentUser:", error.response?.data || error.message);
    return null;
  }
};
