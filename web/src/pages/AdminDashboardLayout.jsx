import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

export default function AdminDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-white text-navy">
      <Sidebar />
      <div className="flex-1">
        <header className="border-b border-gray-200 px-8 py-6">
          <h2 className="text-center text-2xl font-bold text-navy">Admin Dashboard</h2>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

