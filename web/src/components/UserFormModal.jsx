import { useState } from "react";

const COURSES = ["BSIT", "BSCS", "BSN", "BSBA", "BSED", "BSA", "BSCE", "BSEE"];

export default function UserFormModal({ initialUser, onSave, onClose }) {
  const isEditing = Boolean(initialUser);
  const [firstName, setFirstName] = useState(initialUser?.first_name ?? "");
  const [lastName, setLastName] = useState(initialUser?.last_name ?? "");
  const [email, setEmail] = useState(initialUser?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(initialUser?.role ?? "student");
  const [course, setCourse] = useState(initialUser?.course ?? COURSES[0]);
  const [schoolId, setSchoolId] = useState(initialUser?.school_id ?? "");
  const [isActive, setIsActive] = useState(initialUser?.is_active ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSaving(true);
    try {
      if (isEditing) {
        await onSave({
          first_name: firstName,
          last_name: lastName,
          role,
          course: role === "student" ? course : null,
          school_id: role === "student" ? schoolId : null,
          is_active: isActive,
        });
      } else {
        await onSave({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          role,
          ...(role === "student" ? { course, school_id: schoolId } : {}),
        });
      }
      onClose();
    } catch (err) {
      const details = err.response?.data?.details;
      const firstDetail = details ? Object.values(details)[0]?.[0] : null;
      setErrorMessage(firstDetail || err.response?.data?.message || "Could not save this user.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
      >
        <h3 className="mb-4 text-lg font-bold text-navy">
          {isEditing ? "Edit User" : "Add User"}
        </h3>

        <div className="mb-3 flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-sm text-gray-600">First name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm text-gray-600">Last name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
        </div>

        {!isEditing && (
          <>
            <label className="mb-1 block text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
            />

            <label className="mb-1 block text-sm text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </>
        )}

        <label className="mb-1 block text-sm text-gray-600">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        {role === "student" && (
          <>
            <label className="mb-1 block text-sm text-gray-600">Course</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
            >
              {COURSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <label className="mb-1 block text-sm text-gray-600">School ID</label>
            <input
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </>
        )}

        {isEditing && (
          <label className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold/40"
            />
            Active
          </label>
        )}

        {errorMessage && <p className="mb-3 text-sm text-red-600">{errorMessage}</p>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-1.5 text-sm text-gray-500 transition-colors hover:text-navy"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-navy px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-navy-dark disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
