import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ustpLogo from "../assets/ustp-logo.png";

// Matches the sidebar in ui-prototype/admin_ticket_board.png and
// admin_faq_management.png exactly.
const navItems = [
  { label: "User Management", to: "/users", enabled: true },
  { label: "Tickets", to: "/tickets", enabled: true },
  { label: "FAQs", to: "/faqs", enabled: true },
  { label: "Analytics Overview", to: "/analytics", enabled: true },
  { label: "Settings", to: "/settings", enabled: true },
];

export default function Sidebar() {
  const { currentUser, logout } = useAuth();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col justify-between bg-navy px-6 py-6 text-white">
      <div>
        <div className="mb-10 flex items-center gap-2">
          <img src={ustpLogo} alt="USTP logo" className="h-10 w-auto" />
          <h1 className="font-plus-jakarta text-lg font-bold">Admin Panel</h1>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) =>
            item.enabled ? (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-lg border-l-2 px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "border-gold bg-white/5 font-semibold text-gold"
                      : "border-transparent text-white/70 hover:border-white/30 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <span
                key={item.label}
                className="block cursor-not-allowed rounded-lg border-l-2 border-transparent px-3 py-2 text-sm text-white/30"
                title="Coming in a later sprint"
              >
                {item.label}
              </span>
            )
          )}
        </nav>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-4">
        <span className="truncate text-sm font-semibold" title={currentUser?.email}>
          {currentUser?.email}
        </span>
        <button
          type="button"
          onClick={logout}
          className="shrink-0 rounded-full border border-gold px-4 py-1.5 text-sm font-medium text-gold transition-colors hover:bg-gold hover:text-navy-dark"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}

