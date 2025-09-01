
import api from "./axios";

const AUTH_URL = "/auth"; 
class AuthService {
  async login(username, password) {
    try {
      const response = await api.post(`${AUTH_URL}/login`, {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", username);
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || "Login failed";
    }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  }
}

export default new AuthService();

