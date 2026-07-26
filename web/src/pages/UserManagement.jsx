import { useEffect, useMemo, useState } from "react";
import { createUser, deleteUser, getUsers, updateUser } from "../api/users.js";
import UserFormModal from "../components/UserFormModal.jsx";
import { ErrorState, LoadingState } from "../components/PageState.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function UserManagement() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortDirection, setSortDirection] = useState("asc");

  const loadUsers = () => {
    setIsLoading(true);
    getUsers({
      search: search || undefined,
      role: roleFilter === "All" ? undefined : roleFilter,
      status: statusFilter === "All" ? undefined : statusFilter,
    })
      .then((res) => {
        setUsers(res.data.results ?? res.data);
        setTotalCount(res.data.count ?? (res.data.results ?? res.data).length);
      })
      .catch(() => setError("Could not load users."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(loadUsers, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter, statusFilter]);

  const visibleUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
      return sortDirection === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }, [users, sortDirection]);

  const activeCount = useMemo(() => users.filter((u) => u.is_active).length, [users]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(userId);
      loadUsers();
    } catch (err) {
      window.alert(err.response?.data?.message || "Could not delete this user.");
    }
  };

  const handleSave = async (payload) => {
    if (editingUser) {
      await updateUser(editingUser.user_id, payload);
    } else {
      await createUser(payload);
    }
    loadUsers();
  };

  if (isLoading && users.length === 0) return <LoadingState label="Loading users..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-navy">User Management</h3>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="rounded-full border border-gray-300 px-4 py-1.5 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
          <button
            type="button"
            onClick={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
            className="rounded-full border border-gold px-4 py-1.5 text-sm font-medium text-navy transition-colors hover:bg-gold hover:text-white"
          >
            Add User
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-navy">{totalCount}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-sm text-gray-500">Active Users</p>
          <p className="text-2xl font-bold text-navy">{activeCount}</p>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <span className="text-sm font-semibold text-navy">Filters</span>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-full border border-gray-300 px-3 py-1 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
          <option value="All">All Roles</option>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-full border border-gray-300 px-3 py-1 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
          <option value="All">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
          className="rounded-full border border-gray-300 px-3 py-1 text-sm text-navy transition-colors hover:border-gold"
        >
          Sort: Name {sortDirection === "asc" ? "A-Z" : "Z-A"}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-navy text-sm text-white">
              <th className="px-4 py-3 font-semibold">Full Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Last Login</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              visibleUsers.map((user) => {
                const isSelf = user.user_id === currentUser?.user_id;
                return (
                  <tr
                    key={user.user_id}
                    className="border-b border-gray-100 text-navy transition-colors last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.school_id || "—"}</td>
                    <td className="px-4 py-3 capitalize">{user.role}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-4 py-3">
                      {!isSelf && (
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setIsModalOpen(true);
                            }}
                            aria-label="Edit user"
                            className="text-gray-500 transition-colors hover:text-blue-600"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M4 20h4l10.5-10.5a2 2 0 0 0 0-2.83l-1.17-1.17a2 2 0 0 0-2.83 0L4 16v4z"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.8" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(user.user_id)}
                            aria-label="Delete user"
                            className="text-gray-500 transition-colors hover:text-red-500"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M5 7h14M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m-7 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <UserFormModal
          initialUser={editingUser}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
}
