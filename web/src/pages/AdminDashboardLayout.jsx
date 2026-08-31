import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

const PAGE_META = {
  "/users": { title: "User Management", subtitle: "View and manage OSA and student accounts" },
  "/tickets": { title: "Tickets", subtitle: "Review and resolve escalated student inquiries" },
  "/faqs": { title: "FAQs", subtitle: "Maintain the chatbot's knowledge base" },
  "/analytics": { title: "Analytics Overview", subtitle: "Inquiry trends and ticket performance" },
  "/logs": { title: "Inquiry Logs", subtitle: "Raw chatbot conversation history" },
  "/announcements": { title: "Announcements", subtitle: "Broadcast updates to all students" },
  "/settings": { title: "Settings", subtitle: "Manage your admin account" },
};

export default function AdminDashboardLayout() {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] ?? { title: "Admin Dashboard", subtitle: "" };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-navy">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="shrink-0 bg-white px-8 py-5 shadow-sm">
          <h2 className="font-plus-jakarta text-xl font-bold text-navy">{meta.title}</h2>
          {meta.subtitle && <p className="mt-0.5 text-sm text-gray-500">{meta.subtitle}</p>}
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
