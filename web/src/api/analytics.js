import axiosClient from "./axiosClient.js";

// Mock data used until Veejay's /api/v1/analytics/overview/ is merged to develop
// (currently only exists on his draft branch feature/analytics-aggregation, PR #11).
// Shape must match his real response exactly - see claude/API_CONTRACT.md.
const MOCK_ANALYTICS = {
  total_inquiries: 128,
  total_escalations: 34,
  resolution_rate: 0.62,
  intent_frequencies: [
    { intent: "enrollment_requirements", count: 40 },
    { intent: "scholarship_inquiry", count: 25 },
    { intent: "clearance_process", count: 18 },
    { intent: "unresolved_complex_query", count: 34 },
    { intent: "general_inquiry", count: 11 },
  ],
  tickets_by_status: { pending: 5, active: 8, resolved: 21 },
};

export const getAnalyticsOverview = async () => {
  try {
    const res = await axiosClient.get("/analytics/overview/");
    return res.data;
  } catch (error) {
    console.warn("Analytics endpoint not available yet, using mock data.", error);
    return MOCK_ANALYTICS;
  }
};