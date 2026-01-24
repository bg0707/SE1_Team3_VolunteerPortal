import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  fetchUserDetails,
  fetchUsers,
  updateUserStatus,
  type UserDetails,
  type UserSummary,
} from "../api/admin.api";

const PAGE_SIZE = 10;

export default function AdminUserManagement() {
  const { token } = useAuth();
  const authToken = useMemo(() => token ?? "", [token]);

  const [users, setUsers] = useState<UserSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const loadUsers = async () => {
    if (!authToken) return;
    setLoading(true);
    setError(null);

    try {
      const data = await fetchUsers(authToken, {
        search: search.trim() || undefined,
        role: role || undefined,
        status: status || undefined,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      });
      setUsers(data.users);
      setTotal(data.total);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [authToken, search, role, status, page]);

  useEffect(() => {
    setPage(1);
  }, [search, role, status]);

  const handleRowClick = async (userId: number) => {
    if (!authToken) return;
    try {
      const details = await fetchUserDetails(authToken, userId);
      setSelectedUser(details);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load user details");
    }
  };

  const handleStatusChange = async (
    user: UserSummary,
    nextStatus: "active" | "suspended" | "deactivated"
  ) => {
    if (!authToken) return;
    const confirm = window.confirm(
      `Are you sure you want to set ${user.email} to ${nextStatus}?`
    );
    if (!confirm) return;

    try {
      await updateUserStatus(authToken, user.userId, nextStatus);
      await loadUsers();
      if (selectedUser?.user.userId === user.userId) {
        const details = await fetchUserDetails(authToken, user.userId);
        setSelectedUser(details);
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to update user status");
    }
  };

  if (!authToken) {
    return (
      <div className="p-6 mt-20 text-center text-red-600">
        Unauthorized access.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-20 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
          <p className="text-gray-600 text-sm">
            Manage volunteers, organizations, and admins.
          </p>
        </div>
        <button
          onClick={loadUsers}
          className="px-4 py-2 border rounded hover:bg-gray-50 text-sm sm:text-base"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="border rounded px-3 py-2 w-full"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">All roles</option>
          <option value="volunteer">Volunteer</option>
          <option value="organization">Organization</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="deactivated">Deactivated</option>
        </select>
        <div className="text-sm text-gray-600 flex items-center">
          Total: {total}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="overflow-x-auto border rounded bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">User Type</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Created</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center">
                      Loading...
                    </td>
                  </tr>
                )}
                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center">
                      No users found.
                    </td>
                  </tr>
                )}
                {!loading &&
                  users.map((user) => (
                    <tr
                      key={user.userId}
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(user.userId)}
                    >
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3 capitalize">{user.role}</td>
                      <td className="px-4 py-3 capitalize">{user.status}</td>
                      <td className="px-4 py-3">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td
                        className="px-4 py-3"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div className="flex flex-wrap gap-2">
                          {user.status !== "suspended" && (
                            <button
                              onClick={() => handleStatusChange(user, "suspended")}
                              className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                            >
                              Suspend
                            </button>
                          )}
                          {user.status !== "deactivated" && (
                            <button
                              onClick={() =>
                                handleStatusChange(user, "deactivated")
                              }
                              className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                            >
                              Deactivate
                            </button>
                          )}
                          {user.status !== "active" && (
                            <button
                              onClick={() => handleStatusChange(user, "active")}
                              className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4 text-sm">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded disabled:opacity-50 w-full sm:w-auto"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 border rounded disabled:opacity-50 w-full sm:w-auto"
            >
              Next
            </button>
          </div>
        </div>

        <div className="border rounded bg-white p-4 h-fit">
          <h2 className="text-lg font-semibold mb-3">User Details</h2>
          {!selectedUser && (
            <p className="text-gray-600 text-sm">Select a user to view details.</p>
          )}
          {selectedUser && (
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-semibold">{selectedUser.user.email}</div>
                <div className="capitalize text-gray-600">
                  {selectedUser.user.role} • {selectedUser.user.status}
                </div>
              </div>
              {selectedUser.volunteer && (
                <div>
                  <div className="font-medium">Volunteer</div>
                  <div>Name: {selectedUser.volunteer.fullName}</div>
                  {selectedUser.volunteer.age && (
                    <div>Age: {selectedUser.volunteer.age}</div>
                  )}
                </div>
              )}
              {selectedUser.organization && (
                <div>
                  <div className="font-medium">Organization</div>
                  <div>Name: {selectedUser.organization.name}</div>
                  {selectedUser.organization.description && (
                    <div>Description: {selectedUser.organization.description}</div>
                  )}
                  <div>
                    Verified: {selectedUser.organization.isVerified ? "Yes" : "No"}
                  </div>
                </div>
              )}
              <div className="text-gray-500">
                Created:{" "}
                {new Date(selectedUser.user.createdAt).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
