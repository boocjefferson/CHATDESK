import { useAuth } from "../context/AuthContext.jsx";

// No mockup exists for this screen in ui-prototype/, so this is a structural
// shell only, styled to match the other admin screens.
export default function AdminSettings() {
  const { currentUser } = useAuth();

  return (
    <section className="max-w-md">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-500">Signed in as</p>
        <p className="font-medium text-navy">{currentUser?.email}</p>
        <p className="text-sm text-gray-500">Role: {currentUser?.role}</p>
      </div>
    </section>
  );
}
