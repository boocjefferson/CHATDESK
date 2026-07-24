import { useAuth } from "../context/AuthContext.jsx";

// No mockup exists for this screen in ui-prototype/, so this is a structural
// shell only, styled to match the other admin screens. Change-password isn't
// in claude/API_CONTRACT.md yet - add it there first if this needs to go live.
export default function AdminSettings() {
  const { currentUser } = useAuth();

  return (
    <section className="max-w-md">
      <h3 className="mb-5 text-lg font-bold text-navy">Settings</h3>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-500">Signed in as</p>
        <p className="font-medium text-navy">{currentUser?.email}</p>
        <p className="text-sm text-gray-500">Role: {currentUser?.role}</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 opacity-60 shadow-sm">
        <h4 className="mb-3 font-medium text-navy">Change Password</h4>
        <input
          type="password"
          placeholder="Current password"
          disabled
          className="mb-3 w-full rounded-lg border border-gray-300 px-4 py-2"
        />
        <input
          type="password"
          placeholder="New password"
          disabled
          className="mb-3 w-full rounded-lg border border-gray-300 px-4 py-2"
        />
        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-lg border border-gray-300 py-2 font-medium text-gray-400"
        >
          Update Password
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Change-password isn&apos;t in API_CONTRACT.md yet - this is a placeholder shell only.
      </p>
    </section>
  );
}
