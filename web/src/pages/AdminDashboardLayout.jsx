import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

const PAGE_META = {
  "/users": { title: "User Management", subtitle: "View and manage OSA and student accounts" },
  "/tickets": { title: "Tickets", subtitle: "Review and resolve escalated student inquiries" },
  "/faqs": { title: "FAQs", subtitle: "Maintain the chatbot's knowledge base" },
  "/analytics": { title: "Analytics Overview", subtitle: "Inquiry trends and ticket performance" },
  "/logs": { title: "Inquiry Logs", subtitle: "Raw chatbot conversation history" },
  "/announcements": { title: "Announcements", subtitle: "Broadcast updates to all students" },
  "/phases": { title: "Phases", subtitle: "Manage USTP calendar phases and student guidance" },
  "/offices": { title: "Offices", subtitle: "Manage offices and colleges for routing FAQs and tickets" },
  "/settings": { title: "Settings", subtitle: "Manage your account" },
};

export default function AdminDashboardLayout() {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] ?? { title: "Super Admin Dashboard", subtitle: "" };
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-navy">
      <Sidebar isMobileOpen={isMobileSidebarOpen} onCloseMobile={() => setIsMobileSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center gap-3 bg-white px-5 py-5 shadow-sm sm:px-8">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-navy outline-none transition-colors duration-150 hover:border-gold focus-visible:ring-2 focus-visible:ring-gold/60 lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="min-w-0">
            <h2 className="truncate font-plus-jakarta text-xl font-bold text-navy">{meta.title}</h2>
            {meta.subtitle && <p className="mt-0.5 truncate text-sm text-gray-500">{meta.subtitle}</p>}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
