import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ustpLogo from "../assets/1.png";

const NAV_SECTIONS = [
  {
    label: "Workspace",
    items: [
      {
        label: "Tickets",
        to: "/tickets",
        icon: (
          <path
            d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 6v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-6V7ZM12 5v14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 3"
          />
        ),
      },
      {
        label: "FAQs",
        to: "/faqs",
        icon: (
          <path
            d="M9 9a3 3 0 1 1 4 2.83c-.6.25-1 .85-1 1.5V14M12 17.5h.01M4 5h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8l-4 3V6a1 1 0 0 1 1-1Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ),
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        label: "Analytics Overview",
        to: "/analytics",
        icon: (
          <path
            d="M4 20V10M10 20V4M16 20v-7M22 20H2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ),
      },
      {
        label: "Inquiry Logs",
        to: "/logs",
        icon: (
          <path
            d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 12h6M9 16h6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ),
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        label: "User Management",
        to: "/users",
        superAdminOnly: true,
        icon: (
          <path
            d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ),
      },
      {
        label: "Announcements",
        to: "/announcements",
        superAdminOnly: true,
        icon: (
          <path
            d="M4 6h11l4-3v18l-4-3H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1ZM8 15v3a2 2 0 0 0 2 2h1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ),
      },
      {
        label: "Phases",
        to: "/phases",
        superAdminOnly: true,
        icon: (
          <path
            d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ),
      },
      {
        label: "Offices",
        to: "/offices",
        superAdminOnly: true,
        icon: (
          <path
            d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ),
      },
    ],
  },
];

const SETTINGS_ITEM = {
  label: "Settings",
  to: "/settings",
  icon: (
    <path
      d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

const LOGOUT_ICON = (
  <path
    d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

function initialsFor(firstName, lastName, email) {
  if (firstName || lastName) {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";
  }
  return email ? email.slice(0, 2).toUpperCase() : "?";
}

function roleLabel(currentUser) {
  if (currentUser?.role === "superadmin") return "Super Admin";
  if (currentUser?.role === "office_admin") return currentUser?.office_name ?? "Office Admin";
  return currentUser?.role ?? "";
}

function useStoredBoolean(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored === null ? defaultValue : stored === "true";
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, String(value));
    } catch {
      // Private-browsing / storage-disabled - the preference just won't persist.
    }
  }, [key, value]);

  return [value, setValue];
}

function NavItem({ item, isCollapsed, isLight, onNavigate }) {
  return (
    <NavLink
      to={item.to}
      title={isCollapsed ? item.label : undefined}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-gold/60 ${
          isCollapsed ? "justify-center px-0" : ""
        } ${
          isActive
            ? isLight
              ? "bg-navy/[0.06] font-semibold text-navy"
              : "bg-white font-semibold text-navy shadow-sm"
            : isLight
            ? "text-gray-500 hover:bg-gray-50 hover:text-navy"
            : "text-white/65 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span aria-hidden="true" className="absolute inset-y-1.5 left-0 w-1 rounded-full bg-gold" />
          )}
          <svg
            className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-gold" : "text-current"}`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {item.icon}
          </svg>
          <span className={isCollapsed ? "sr-only" : "truncate"}>{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ isMobileOpen = false, onCloseMobile = () => {} }) {
  const { currentUser, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useStoredBoolean("chatdesk_sidebar_collapsed", false);
  const [theme, setTheme] = useStoredBoolean("chatdesk_sidebar_light", false);
  const isLight = theme === true;

  useEffect(() => {
    if (!isMobileOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onCloseMobile();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  const isSuperAdmin = currentUser?.role === "superadmin";
  const visibleSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => !item.superAdminOnly || isSuperAdmin),
  })).filter((section) => section.items.length > 0);

  const containerBase = isLight ? "bg-white text-navy" : "bg-navy text-white";
  const borderClass = isLight ? "border-gray-100" : "border-white/10";
  const sectionLabelClass = isLight ? "text-gray-500" : "text-white/55";
  const wordmarkTextClass = isLight ? "text-navy" : "text-white";
  const toggleBtnClass = isLight
    ? "border-gray-200 text-gray-400 hover:border-gold hover:text-navy"
    : "border-white/15 text-white/60 hover:border-gold hover:text-white";
  const profileCardClass = isLight
    ? "bg-gray-50 border-gray-100"
    : "bg-white/5 border-white/10";
  const profileNameClass = isLight ? "text-navy" : "text-white";
  const profileSubClass = isLight ? "text-gray-500" : "text-white/60";
  const logoutBtnClass = isLight
    ? "border-gray-200 text-gray-500 hover:border-gold hover:text-navy"
    : "border-white/15 text-white/80 hover:border-gold hover:text-gold";

  return (
    <>
      {isMobileOpen && (
        <div
          aria-hidden="true"
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen shrink-0 flex-col justify-between border-r ${borderClass} ${containerBase} px-4 py-6 transition-[transform,width] duration-300 ease-in-out lg:relative lg:z-auto ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${isCollapsed ? "lg:w-20" : "lg:w-64"} w-72`}
      >
        <div
          className={`sidebar-scroll min-h-0 flex-1 overflow-y-auto ${
            isLight ? "sidebar-scroll-light" : "sidebar-scroll-dark"
          }`}
        >
          <div className={`mb-6 flex items-center gap-2.5 px-1 ${isCollapsed ? "lg:justify-center" : ""}`}>
            <div className="flex h-9 w-8 shrink-0 items-center justify-center rounded-md bg-navy p-1">
              <img src={ustpLogo} alt="ChatDesk logo" className="h-full w-full object-contain" />
            </div>
            <span
              className={`font-plus-jakarta text-lg font-bold ${wordmarkTextClass} ${
                isCollapsed ? "lg:hidden" : ""
              }`}
            >
              Chat<span className="text-gold">Desk</span>
            </span>

            <button
              type="button"
              onClick={() => setIsCollapsed((prev) => !prev)}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!isCollapsed}
              className={`ml-auto hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-gold/60 lg:flex ${toggleBtnClass}`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
              >
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close menu"
              className={`ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-gold/60 lg:hidden ${toggleBtnClass}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <nav className="space-y-5">
            {visibleSections.map((section) => (
              <div key={section.label}>
                <p
                  className={`mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider ${sectionLabelClass} ${
                    isCollapsed ? "lg:sr-only" : ""
                  }`}
                >
                  {section.label}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavItem
                      key={item.label}
                      item={item}
                      isCollapsed={isCollapsed}
                      isLight={isLight}
                      onNavigate={onCloseMobile}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div className={`border-t pt-3 ${borderClass}`}>
              <NavItem item={SETTINGS_ITEM} isCollapsed={isCollapsed} isLight={isLight} onNavigate={onCloseMobile} />
            </div>
          </nav>
        </div>

        <div className={`mt-4 shrink-0 border-t pt-4 ${borderClass}`}>
          <div
            className={`mb-3 flex items-center gap-2.5 rounded-xl border p-2 ${profileCardClass} ${
              isCollapsed ? "lg:justify-center lg:border-transparent lg:bg-transparent lg:p-0" : ""
            }`}
          >
            {currentUser?.profile_picture ? (
              <img
                src={currentUser.profile_picture}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-navy-dark">
                {initialsFor(currentUser?.first_name, currentUser?.last_name, currentUser?.email)}
              </div>
            )}
            <div className={`min-w-0 flex-1 ${isCollapsed ? "lg:hidden" : ""}`}>
              <p className={`truncate text-sm font-medium leading-tight ${profileNameClass}`} title={currentUser?.email}>
                {currentUser?.first_name ? `${currentUser.first_name} ${currentUser.last_name}` : currentUser?.email}
              </p>
              <p className={`truncate text-xs leading-tight ${profileSubClass}`}>{roleLabel(currentUser)}</p>
            </div>
          </div>

          <div className={`mb-3 flex items-center justify-between gap-2 px-1 ${isCollapsed ? "lg:hidden" : ""}`}>
            <span className={`text-xs font-medium ${isLight ? "text-gray-500" : "text-white/70"}`}>
              Light sidebar
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isLight}
              aria-label="Toggle light sidebar"
              onClick={() => setTheme((prev) => !prev)}
              className={`relative h-6 w-11 shrink-0 rounded-full outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-gold/60 ${
                isLight ? "bg-gold" : "bg-white/20"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  isLight ? "translate-x-[22px]" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={logout}
            title={isCollapsed ? "Log Out" : undefined}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-gold/60 ${logoutBtnClass}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {LOGOUT_ICON}
            </svg>
            <span className={isCollapsed ? "lg:sr-only" : ""}>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
