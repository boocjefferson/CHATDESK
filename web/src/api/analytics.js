import axiosClient from "./axiosClient.js";

export const getAnalyticsOverview = async (params = {}) => {
  const res = await axiosClient.get("/analytics/overview/", { params });
  return res.data;
};