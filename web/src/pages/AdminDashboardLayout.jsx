import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

const PAGE_TITLES = {
  "/tickets": "Tickets",
  "/faqs": "FAQs",
  "/analytics": "Analytics Overview",
  "/settings": "Settings",
};

export default function AdminDashboardLayout() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? "Admin Dashboard";

  return (
    <div className="flex min-h-screen bg-gray-50 text-navy">
      <Sidebar />
      <div className="flex-1">
        <header className="border-b border-gray-200 bg-white px-8 py-6">
          <h2 className="text-center font-plus-jakarta text-2xl font-bold text-navy">{title}</h2>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

