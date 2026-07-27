import axiosClient from "./axiosClient.js";

export const getInquiryLogs = async () => {
  const res = await axiosClient.get("/inquiry-logs/");
  return res.data.results ?? res.data;
};