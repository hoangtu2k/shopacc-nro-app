
import axios from "./axioConfig";

export const loginAdmin = (username, password) =>
  axios.post("/auth/admin/login", { username, password });

export const fetchCurrentUser = (token) =>
  axios.get("/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
