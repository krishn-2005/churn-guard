import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 30000,
});

// Upload CSV → predictions array
export async function predictBatch(file) {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await apiClient.post("/predict", formData);
    return response.data.predictions || [];
  } catch (error) {
    if (error.response) throw new Error(error.response.data?.detail || `Server error: ${error.response.status}`);
    throw new Error("No response from server. Is the backend running?");
  }
}

// Upload CSV → analytics data
export async function fetchAnalytics(file) {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await apiClient.post("/analytics", formData);
    return response.data;
  } catch (error) {
    if (error.response) throw new Error(error.response.data?.detail || `Server error: ${error.response.status}`);
    throw new Error("No response from server. Is the backend running?");
  }
}
