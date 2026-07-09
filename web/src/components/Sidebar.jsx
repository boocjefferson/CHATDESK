import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ustpLogo from "../assets/ustp-logo.png";

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
    <aside className="flex h-screen w-64 flex-col justify-between bg-navy px-6 py-6 text-white">
      <div>
        <div className="mb-8 flex items-center gap-2">
          <img src={ustpLogo} alt="USTP logo" className="h-10 w-auto" />
          <h1 className="text-lg font-bold">Admin Panel</h1>
        </div>
        <nav className="space-y-4">
          {navItems.map((item) =>
            item.enabled ? (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `block border-l-2 pl-3 text-base ${
                    isActive
                      ? "border-gold font-bold text-gold"
                      : "border-transparent text-white/80 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <span
                key={item.label}
                className="block cursor-not-allowed border-l-2 border-transparent pl-3 text-base text-white/40"
                title="Coming in a later sprint"
              >
                {item.label}
              </span>
            )
          )}
        </nav>
      </div>

      <div className="flex items-center justify-between border-t border-white/20 pt-4">
        <span className="truncate text-sm font-bold">{currentUser?.email}</span>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-gold px-4 py-1 text-sm text-gold hover:bg-gold hover:text-navy-dark"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}

