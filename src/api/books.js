import api from "./axios";



export const getBooks = async (params = {}) => {
  const res = await api.get("/books", { params });
  return res.data;
};



export const getBookById = async (id) => {
  const res = await api.get(`/books/${id}`);
  return res.data;
};


export const createBook = async (data) => {
  const res = await api.post("/books", data);
  return res.data;
};


 
 
export const updateBook = async (id, data) => {
  const res = await api.patch(`/books/${id}`, data);
  return res.data;
};



 
export const deleteBook = async (id) => {
  const res = await api.delete(`/books/${id}`);
  return res.data;
};
