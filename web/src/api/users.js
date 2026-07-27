import axiosClient from "./axiosClient.js";

export const getUsers = (params = {}) => axiosClient.get("/users/", { params });

export const createUser = (payload) => axiosClient.post("/users/", payload);

export const updateUser = (userId, payload) => axiosClient.patch(`/users/${userId}/`, payload);

export const deleteUser = (userId) => axiosClient.delete(`/users/${userId}/`);
