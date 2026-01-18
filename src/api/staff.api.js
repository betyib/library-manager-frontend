import api from "./axios";

export const getStaff = () => {
  return api.get("/staff");
};

export const createStaff = (data) => {
  return api.post("/staff", data);
};

export const updateStaff = (id, data) => {
  return api.patch(`/staff/${id}`, data);
};

export const deleteStaff = (id) => {
  return api.delete(`/staff/${id}`);
};
