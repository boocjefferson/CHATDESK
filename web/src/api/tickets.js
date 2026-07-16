import axiosClient from "./axiosClient.js";

export const getTickets = (params = {}) => axiosClient.get("/tickets/", { params });

export const updateTicket = (ticketId, payload) =>
  axiosClient.patch(`/tickets/${ticketId}/`, payload);