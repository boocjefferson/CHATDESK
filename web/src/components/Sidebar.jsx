import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Matches the sidebar in ui-prototype/admin_ticket_board.png and
// admin_faq_management.png exactly. User Management and Analytics Overview
// are shown per the prototype but are not built this sprint (Sprint 2+).
const navItems = [
  { label: "User Management", to: "/users", enabled: false },
  { label: "Tickets", to: "/tickets", enabled: true },
  { label: "FAQs", to: "/faqs", enabled: true },
  { label: "Analytics Overview", to: "/analytics", enabled: false },
  { label: "Settings", to: "/settings", enabled: true },
];

export default function Sidebar() {
  const { currentUser, logout } = useAuth();

  return (
    <aside className="flex h-screen w-64 flex-col justify-between border-r border-gray-300 px-6 py-6">
      <div>
        <h1 className="mb-8 text-xl font-bold">Admin Panel</h1>
        <nav className="space-y-4">
          {navItems.map((item) =>
            item.enabled ? (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `block text-base ${isActive ? "font-bold text-black" : "text-gray-800 hover:text-black"}`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <span
                key={item.label}
                className="block cursor-not-allowed text-base text-gray-400"
                title="Coming in a later sprint"
              >
                {item.label}
              </span>
            )
          )}
        </nav>
      </div>

      <div className="flex items-center justify-between border-t border-gray-300 pt-4">
        <span className="truncate text-sm font-bold">{currentUser?.email}</span>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-gray-400 px-4 py-1 text-sm hover:bg-gray-100"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}
