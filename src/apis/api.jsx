import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const getRecommendations = async (genre, num) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/recommend`, {
      genre,
      num_recommendations: num,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return { error: "Failed to fetch data" };
  }
};

export const getRecommendationsByTrack = async (tracks, num) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/recommend_by_tracks`, {
      tracks,
      num_recommendations: num,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return { error: "Failed to fetch recommendations" };
  }
};
