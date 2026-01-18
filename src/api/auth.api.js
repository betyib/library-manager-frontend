import api from "./axios";

export const login = (credentials) => {
  return api.post("/auth/login", credentials);
};

export const signup = (data) => {
  return api.post("/auth/signup", data);
};