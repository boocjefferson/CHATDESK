import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboardLayout from "./pages/AdminDashboardLayout.jsx";
import TicketManagement from "./pages/TicketManagement.jsx";
import FaqManagement from "./pages/FaqManagement.jsx";
import AdminSettings from "./pages/AdminSettings.jsx";
import AnalyticsOverview from "./pages/AnalyticsOverview.jsx";
import InquiryLogs from "./pages/InquiryLogs.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/tickets" replace />} />
        <Route path="tickets" element={<TicketManagement />} />
        <Route path="faqs" element={<FaqManagement />} />
        <Route path="analytics" element={<AnalyticsOverview />} />
        <Route path="logs" element={<InquiryLogs />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
