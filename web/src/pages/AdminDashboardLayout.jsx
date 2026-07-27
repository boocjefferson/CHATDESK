import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

const PAGE_TITLES = {
  "/users": "User Management",
  "/tickets": "Tickets",
  "/faqs": "FAQs",
  "/analytics": "Analytics Overview",
  "/settings": "Settings",
};

export default function AdminDashboardLayout() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? "Admin Dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-navy">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-gray-200 bg-white px-8 py-6">
          <h2 className="text-center font-plus-jakarta text-2xl font-bold text-navy">{title}</h2>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

