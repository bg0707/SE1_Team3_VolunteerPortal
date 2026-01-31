import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import PendingOrganization from "../components/pendingVerification";
import {
  getPendingOrganizations,
  verifyOrganization,
} from "../api/verification.api";
import {
  fetchOrganizationDetails,
  fetchOrganizations,
  fetchAllOpportunities,
  fetchReportedOpportunities,
  moderateOpportunity,
  reviewOrganization,
  fetchActivityLogs,
  type ReportedOpportunity,
  type OrganizationDetails,
  type OrganizationSummary,
  type AdminOpportunity,
  fetchUserDetails,
  fetchUsers,
  updateUserStatus,
  type UserDetails,
  type UserSummary,
  type ActivityLog,
} from "../api/admin.api";

type Tab = "organizations" | "reports" | "users" | "org-directory" | "opps" | "activity";

interface Organization {
  organizationId: number;
  email: string;
  name: string;
  description: string;
}

const USERS_PAGE_SIZE = 10;
const ORGS_PAGE_SIZE = 10;
const OPPS_PAGE_SIZE = 10;
const ACTIVITY_PAGE_SIZE = 20;

export default function AdminPanel() {
  const { token } = useAuth();
  const authToken = useMemo(() => token ?? "", [token]);

  const [tab, setTab] = useState<Tab>("organizations");
  const [pendingOrgs, setPendingOrgs] = useState<Organization[]>([]);
  const [reportedOpps, setReportedOpps] = useState<ReportedOpportunity[]>([]);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersSearch, setUsersSearch] = useState("");
  const [usersRole, setUsersRole] = useState("volunteer,admin");
  const [usersStatus, setUsersStatus] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [orgs, setOrgs] = useState<OrganizationSummary[]>([]);
  const [orgsTotal, setOrgsTotal] = useState(0);
  const [orgsPage, setOrgsPage] = useState(1);
  const [orgsSearch, setOrgsSearch] = useState("");
  const [orgsStatus, setOrgsStatus] = useState("");
  const [orgsLoading, setOrgsLoading] = useState(false);
  const [orgsError, setOrgsError] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationDetails | null>(
    null
  );
  const [opps, setOpps] = useState<AdminOpportunity[]>([]);
  const [oppsTotal, setOppsTotal] = useState(0);
  const [oppsPage, setOppsPage] = useState(1);
  const [oppsLoading, setOppsLoading] = useState(false);
  const [oppsError, setOppsError] = useState<string | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [activityTotal, setActivityTotal] = useState(0);
  const [activityPage, setActivityPage] = useState(1);
  const [activityActionFilter, setActivityActionFilter] = useState("");
  const [activityActorFilter, setActivityActorFilter] = useState("");
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userTotalPages = Math.max(1, Math.ceil(usersTotal / USERS_PAGE_SIZE));
  const orgTotalPages = Math.max(1, Math.ceil(orgsTotal / ORGS_PAGE_SIZE));
  const oppTotalPages = Math.max(1, Math.ceil(oppsTotal / OPPS_PAGE_SIZE));
  const activityTotalPages = Math.max(
    1,
    Math.ceil(activityTotal / ACTIVITY_PAGE_SIZE)
  );

  const loadData = async () => {
    if (!authToken) return;

    setLoading(true);
    setError(null);

    try {
      const [orgs, opps] = await Promise.all([
        getPendingOrganizations(authToken),
        fetchReportedOpportunities(authToken),
      ]);

      setPendingOrgs(orgs);
      setReportedOpps(opps);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    if (!authToken) return;
    setUsersLoading(true);
    setUsersError(null);

    try {
      const data = await fetchUsers(authToken, {
        search: usersSearch.trim() || undefined,
        role: usersRole || undefined,
        status: usersStatus || undefined,
        limit: USERS_PAGE_SIZE,
        offset: (usersPage - 1) * USERS_PAGE_SIZE,
      });
      setUsers(data.users);
      setUsersTotal(data.total);
    } catch (e: any) {
      setUsersError(e?.message ?? "Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  const loadOrganizations = async () => {
    if (!authToken) return;
    setOrgsLoading(true);
    setOrgsError(null);

    try {
      const data = await fetchOrganizations(authToken, {
        search: orgsSearch.trim() || undefined,
        verificationStatus: (orgsStatus as
          | "pending"
          | "verified"
          | "rejected"
          | undefined) || undefined,
        limit: ORGS_PAGE_SIZE,
        offset: (orgsPage - 1) * ORGS_PAGE_SIZE,
      });
      setOrgs(data.organizations);
      setOrgsTotal(data.total);
    } catch (e: any) {
      setOrgsError(e?.message ?? "Failed to load organizations");
    } finally {
      setOrgsLoading(false);
    }
  };

  const loadOpportunities = async () => {
    if (!authToken) return;
    setOppsLoading(true);
    setOppsError(null);

    try {
      const data = await fetchAllOpportunities(authToken, {
        limit: OPPS_PAGE_SIZE,
        offset: (oppsPage - 1) * OPPS_PAGE_SIZE,
      });
      setOpps(data.opportunities);
      setOppsTotal(data.total);
    } catch (e: any) {
      setOppsError(e?.message ?? "Failed to load opportunities");
    } finally {
      setOppsLoading(false);
    }
  };

  const loadActivityLogs = async () => {
    if (!authToken) return;
    setActivityLoading(true);
    setActivityError(null);

    const actorUserId = activityActorFilter.trim()
      ? Number(activityActorFilter)
      : Number.NaN;
    try {
      const data = await fetchActivityLogs(authToken, {
        action: activityActionFilter.trim() || undefined,
        actorUserId: Number.isFinite(actorUserId) ? actorUserId : undefined,
        limit: ACTIVITY_PAGE_SIZE,
        offset: (activityPage - 1) * ACTIVITY_PAGE_SIZE,
      });
      setActivityLogs(data.logs);
      setActivityTotal(data.total);
    } catch (e: any) {
      setActivityError(e?.message ?? "Failed to load activity logs");
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [authToken]);

  useEffect(() => {
    if (tab === "users") {
      loadUsers();
    }
    if (tab === "org-directory") {
      loadOrganizations();
    }
    if (tab === "opps") {
      loadOpportunities();
    }
    if (tab === "activity") {
      loadActivityLogs();
    }
  }, [
    authToken,
    tab,
    usersSearch,
    usersRole,
    usersStatus,
    usersPage,
    orgsSearch,
    orgsStatus,
    orgsPage,
    oppsPage,
    activityActionFilter,
    activityActorFilter,
    activityPage,
  ]);

  useEffect(() => {
    setUsersPage(1);
  }, [usersSearch, usersRole, usersStatus]);

  useEffect(() => {
    setOrgsPage(1);
  }, [orgsSearch, orgsStatus]);

  useEffect(() => {
    setOppsPage(1);
  }, [tab]);

  useEffect(() => {
    setActivityPage(1);
  }, [activityActionFilter, activityActorFilter]);

  async function handleVerify(id: number) {
    try {
      await verifyOrganization(id, authToken);
      setPendingOrgs((prev) =>
        prev.filter((org) => org.organizationId !== id)
      );
    } catch {
      alert("Verification failed");
    }
  }

  async function handleReject(id: number) {
    const confirm = window.confirm("Reject this organization?");
    if (!confirm) return;

    try {
      await reviewOrganization(authToken, id, "reject");
      setPendingOrgs((prev) =>
        prev.filter((org) => org.organizationId !== id)
      );
    } catch {
      alert("Rejection failed");
    }
  }

  const handleOpportunityModeration = async (
    opportunityId: number,
    decision: "keep" | "remove"
  ) => {
    try {
      let reason: string | undefined;
      if (decision === "remove") {
        reason =
          window.prompt("Reason for removing this opportunity?")?.trim() ?? "";
        if (!reason) return;
      }

      await moderateOpportunity(authToken, opportunityId, decision, reason);
      setReportedOpps((prev) =>
        prev.filter((x) => x.opportunity.opportunityId !== opportunityId)
      );
    } catch (e: any) {
      alert(e?.message ?? "Moderation failed");
    }
  };

  const handleOpportunityStatusChange = async (
    opportunityId: number,
    action: "suspend" | "unsuspend"
  ) => {
    const verb = action === "suspend" ? "suspend" : "reinstate";
    const confirm = window.confirm(
      `Are you sure you want to ${verb} this opportunity?`
    );
    if (!confirm) return;

    let reason: string | undefined;
    if (action === "suspend") {
      reason = window.prompt("Reason for suspending this opportunity?")?.trim() ?? "";
      if (!reason) return;
    }

    try {
      await moderateOpportunity(authToken, opportunityId, action, reason);
      setOpps((prev) =>
        prev.map((opp) =>
          opp.opportunityId === opportunityId
            ? { ...opp, status: action === "suspend" ? "suspended" : "active" }
            : opp
        )
      );
    } catch (e: any) {
      setOppsError(e?.message ?? "Failed to update opportunity status");
    }
  };

  const handleUserDetails = async (userId: number) => {
    try {
      const details = await fetchUserDetails(authToken, userId);
      setSelectedUser(details);
    } catch (e: any) {
      setUsersError(e?.message ?? "Failed to load user details");
    }
  };

  const handleUserStatusChange = async (
    user: UserSummary,
    status: "active" | "suspended" | "deactivated"
  ) => {
    const confirm = window.confirm(
      `Are you sure you want to set ${user.email} to ${status}?`
    );
    if (!confirm) return;

    try {
      await updateUserStatus(authToken, user.userId, status);
      await loadUsers();
      if (selectedUser?.user.userId === user.userId) {
        const details = await fetchUserDetails(authToken, user.userId);
        setSelectedUser(details);
      }
    } catch (e: any) {
      setUsersError(e?.message ?? "Failed to update user status");
    }
  };

  const handleOrganizationDetails = async (organizationId: number) => {
    try {
      const details = await fetchOrganizationDetails(authToken, organizationId);
      setSelectedOrg(details);
    } catch (e: any) {
      setOrgsError(e?.message ?? "Failed to load organization details");
    }
  };

  const handleOrganizationReview = async (
    organizationId: number,
    decision: "accept" | "reject"
  ) => {
    const confirm = window.confirm(
      `Are you sure you want to ${decision} this organization?`
    );
    if (!confirm) return;

    try {
      await reviewOrganization(authToken, organizationId, decision);
      await loadOrganizations();
      if (decision === "accept") {
        setPendingOrgs((prev) =>
          prev.filter((org) => org.organizationId !== organizationId)
        );
      }
    } catch (e: any) {
      setOrgsError(e?.message ?? "Organization review failed");
    }
  };

  const handleOrganizationStatus = async (
    org: OrganizationSummary,
    status: "active" | "suspended" | "deactivated"
  ) => {
    const confirm = window.confirm(
      `Are you sure you want to set ${org.email} to ${status}?`
    );
    if (!confirm) return;

    try {
      await updateUserStatus(authToken, org.userId, status);
      await loadOrganizations();
      if (selectedOrg?.user.userId === org.userId) {
        const details = await fetchOrganizationDetails(
          authToken,
          org.organizationId
        );
        setSelectedOrg(details);
      }
    } catch (e: any) {
      setOrgsError(e?.message ?? "Failed to update organization status");
    }
  };

  if (!authToken)
    return (
      <div className="p-6 mt-20 text-center text-red-600">
        Unauthorized access.
      </div>
    );

  if (loading)
    return (
      <div className="p-6 mt-20 text-center text-gray-600">Loading...</div>
    );

  return (
    <div className="max-w-6xl mx-auto mt-20 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadData}
            className="px-4 py-2 border rounded hover:bg-gray-50 text-sm sm:text-base"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-8">
        <button
          onClick={() => setTab("organizations")}
          className={`w-full sm:w-auto px-4 py-2 rounded border text-sm sm:text-base ${
            tab === "organizations"
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          Pending Organizations ({pendingOrgs.length})
        </button>
        <button
          onClick={() => setTab("reports")}
          className={`w-full sm:w-auto px-4 py-2 rounded border text-sm sm:text-base ${
            tab === "reports" ? "bg-blue-600 text-white" : "bg-white"
          }`}
        >
          Reported Opportunities ({reportedOpps.length})
        </button>
        <button
          onClick={() => setTab("users")}
          className={`w-full sm:w-auto px-4 py-2 rounded border text-sm sm:text-base ${
            tab === "users" ? "bg-blue-600 text-white" : "bg-white"
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => setTab("org-directory")}
          className={`w-full sm:w-auto px-4 py-2 rounded border text-sm sm:text-base ${
            tab === "org-directory" ? "bg-blue-600 text-white" : "bg-white"
          }`}
        >
          Organizations
        </button>
        <button
          onClick={() => setTab("opps")}
          className={`w-full sm:w-auto px-4 py-2 rounded border text-sm sm:text-base ${
            tab === "opps" ? "bg-blue-600 text-white" : "bg-white"
          }`}
        >
          Opportunities
        </button>
        <button
          onClick={() => setTab("activity")}
          className={`w-full sm:w-auto px-4 py-2 rounded border text-sm sm:text-base ${
            tab === "activity" ? "bg-blue-600 text-white" : "bg-white"
          }`}
        >
          Activity Log
        </button>
      </div>

      {tab === "organizations" && (
        <div className="space-y-4">
          {pendingOrgs.length === 0 && (
            <p className="text-gray-600">No pending organizations 🎉</p>
          )}
          {pendingOrgs.map((org) => (
            <PendingOrganization
              key={org.organizationId}
              org={org}
              onVerify={handleVerify}
              onReject={handleReject}
            />
          ))}
        </div>
      )}

      {tab === "reports" && (
        <section className="space-y-4">
          {reportedOpps.length === 0 ? (
            <div className="text-gray-600">No reported opportunities.</div>
          ) : (
            reportedOpps.map((item) => (
              <div
                key={item.opportunity.opportunityId}
                className="border rounded p-4 bg-white shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">
                      #{item.opportunity.opportunityId} —{" "}
                      {item.opportunity.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      Reports: {item.reportCount}
                    </div>
                    <div className="mt-2 text-gray-700">
                      {item.opportunity.description}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleOpportunityModeration(
                          item.opportunity.opportunityId,
                          "keep"
                        )
                      }
                      className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm"
                    >
                      Keep
                    </button>
                    <button
                      onClick={() =>
                        handleOpportunityModeration(
                          item.opportunity.opportunityId,
                          "remove"
                        )
                      }
                      className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-blue-700">
                    View Detail Reports
                  </summary>
                  <div className="mt-3 space-y-2">
                    {item.reports.map((r) => (
                      <div
                        key={r.reportId}
                        className="text-sm border-t pt-2 mt-2"
                      >
                        <span className="font-semibold text-gray-500">
                          Reason:
                        </span>{" "}
                        {r.content}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ))
          )}
        </section>
      )}

      {tab === "users" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                value={usersSearch}
                onChange={(e) => setUsersSearch(e.target.value)}
                placeholder="Search by name or email"
                className="border rounded px-3 py-2 w-full"
              />
              <select
                value={usersRole}
                onChange={(e) => setUsersRole(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="volunteer,admin">Volunteers + Admins</option>
                <option value="volunteer">Volunteer</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={usersStatus}
                onChange={(e) => setUsersStatus(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="deactivated">Deactivated</option>
              </select>
            </div>

            {usersError && (
              <div className="p-3 bg-red-50 text-red-700 rounded">
                {usersError}
              </div>
            )}

            {usersLoading && (
              <div className="text-gray-600">Loading users...</div>
            )}

            {!usersLoading && (
              <div className="text-sm text-gray-600">
                Total users: {usersTotal}
              </div>
            )}

            {!usersLoading && users.length === 0 && (
              <div className="text-gray-600">No users found.</div>
            )}

            {!usersLoading &&
              users.map((user) => (
                <div
                  key={user.userId}
                  className="p-4 border rounded-lg shadow-sm bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  onClick={() => handleUserDetails(user.userId)}
                >
                  <div>
                    <h2 className="font-bold text-lg">{user.name}</h2>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                    <p className="text-gray-700 text-sm capitalize">
                      {user.role} • {user.status}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Created {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className="flex flex-wrap gap-2"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {user.status !== "suspended" && (
                      <button
                        onClick={() =>
                          handleUserStatusChange(user, "suspended")
                        }
                        className="px-3 py-2 border rounded hover:bg-gray-50 text-sm w-full sm:w-auto"
                      >
                        Suspend
                      </button>
                    )}
                    {user.status !== "deactivated" && (
                      <button
                        onClick={() =>
                          handleUserStatusChange(user, "deactivated")
                        }
                        className="px-3 py-2 border rounded hover:bg-gray-50 text-sm w-full sm:w-auto"
                      >
                        Deactivate
                      </button>
                    )}
                    {user.status !== "active" && (
                      <button
                        onClick={() => handleUserStatusChange(user, "active")}
                        className="px-3 py-2 border rounded hover:bg-gray-50 text-sm w-full sm:w-auto"
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
              <button
                disabled={usersPage <= 1}
                onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border rounded disabled:opacity-50 w-full sm:w-auto"
              >
                Previous
              </button>
              <span>
                Page {usersPage} of {userTotalPages}
              </span>
              <button
                disabled={usersPage >= userTotalPages}
                onClick={() => setUsersPage((p) => Math.min(userTotalPages, p + 1))}
                className="px-3 py-1 border rounded disabled:opacity-50 w-full sm:w-auto"
              >
                Next
              </button>
            </div>
          </div>

          <div className="border rounded bg-white p-4 h-fit">
            <h2 className="text-lg font-semibold mb-3">User Details</h2>
            {!selectedUser && (
              <p className="text-gray-600 text-sm">
                Select a user to view details.
              </p>
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
                      <div>
                        Description: {selectedUser.organization.description}
                      </div>
                    )}
                    <div>
                      Verified:{" "}
                      {selectedUser.organization.isVerified ? "Yes" : "No"}
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
      )}

      {tab === "org-directory" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={orgsSearch}
                onChange={(e) => setOrgsSearch(e.target.value)}
                placeholder="Search by name or email"
                className="border rounded px-3 py-2"
              />
              <select
                value={orgsStatus}
                onChange={(e) => setOrgsStatus(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="">All verification statuses</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {orgsError && (
              <div className="p-3 bg-red-50 text-red-700 rounded">
                {orgsError}
              </div>
            )}

            {orgsLoading && (
              <div className="text-gray-600">Loading organizations...</div>
            )}

            {!orgsLoading && (
              <div className="text-sm text-gray-600">
                Total organizations: {orgsTotal}
              </div>
            )}

            {!orgsLoading && orgs.length === 0 && (
              <div className="text-gray-600">No organizations found.</div>
            )}

            {!orgsLoading && orgs.length > 0 && (
              <div className="overflow-x-auto border rounded bg-white">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="text-left px-4 py-3">Name</th>
                      <th className="text-left px-4 py-3">Email</th>
                      <th className="text-left px-4 py-3">Verification</th>
                      <th className="text-left px-4 py-3">Opportunities</th>
                      <th className="text-left px-4 py-3">Applications</th>
                      <th className="text-left px-4 py-3">Created</th>
                      <th className="text-left px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orgs.map((org) => (
                      <tr
                        key={org.organizationId}
                        className="border-t hover:bg-gray-50 cursor-pointer"
                        onClick={() =>
                          handleOrganizationDetails(org.organizationId)
                        }
                      >
                        <td className="px-4 py-3">{org.name}</td>
                        <td className="px-4 py-3">{org.email}</td>
                        <td className="px-4 py-3 capitalize">
                          {org.verificationStatus}
                        </td>
                        <td className="px-4 py-3">
                          {org.opportunitiesCreated}
                        </td>
                        <td className="px-4 py-3">
                          {org.applicationsReceived}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(org.createdAt).toLocaleDateString()}
                        </td>
                        <td
                          className="px-4 py-3"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <div className="flex flex-wrap gap-2">
                            {org.verificationStatus === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleOrganizationReview(
                                      org.organizationId,
                                      "accept"
                                    )
                                  }
                                  className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleOrganizationReview(
                                      org.organizationId,
                                      "reject"
                                    )
                                  }
                                  className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {org.userStatus !== "suspended" && (
                              <button
                                onClick={() =>
                                  handleOrganizationStatus(org, "suspended")
                                }
                                className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                              >
                                Suspend
                              </button>
                            )}
                            {org.userStatus !== "deactivated" && (
                              <button
                                onClick={() =>
                                  handleOrganizationStatus(org, "deactivated")
                                }
                                className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                              >
                                Deactivate
                              </button>
                            )}
                            {org.userStatus !== "active" && (
                              <button
                                onClick={() =>
                                  handleOrganizationStatus(org, "active")
                                }
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
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
              <button
                disabled={orgsPage <= 1}
                onClick={() => setOrgsPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border rounded disabled:opacity-50 w-full sm:w-auto"
              >
                Previous
              </button>
              <span>
                Page {orgsPage} of {orgTotalPages}
              </span>
              <button
                disabled={orgsPage >= orgTotalPages}
                onClick={() => setOrgsPage((p) => Math.min(orgTotalPages, p + 1))}
                className="px-3 py-1 border rounded disabled:opacity-50 w-full sm:w-auto"
              >
                Next
              </button>
            </div>
          </div>

          <div className="border rounded bg-white p-4 h-fit">
            <h2 className="text-lg font-semibold mb-3">Organization Details</h2>
            {!selectedOrg && (
              <p className="text-gray-600 text-sm">
                Select an organization to view details.
              </p>
            )}
            {selectedOrg && (
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-semibold">{selectedOrg.name}</div>
                  <div className="text-gray-600">
                    {selectedOrg.user.email}
                  </div>
                </div>
                <div className="capitalize text-gray-600">
                  {selectedOrg.isVerified
                    ? "verified"
                    : selectedOrg.user.status === "deactivated"
                    ? "rejected"
                    : "pending"}{" "}
                  • {selectedOrg.user.status}
                </div>
                {selectedOrg.description && (
                  <div>Description: {selectedOrg.description}</div>
                )}
                <div>Opportunities: {selectedOrg.opportunitiesCreated}</div>
                <div>Applications: {selectedOrg.applicationsReceived}</div>
                <div>Volunteers Applied: {selectedOrg.volunteersApplied}</div>
                <div className="text-gray-500">
                  Created:{" "}
                  {new Date(selectedOrg.createdAt).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "opps" && (
        <div className="space-y-4">
          {oppsError && (
            <div className="p-3 bg-red-50 text-red-700 rounded">
              {oppsError}
            </div>
          )}

          {oppsLoading && (
            <div className="text-gray-600">Loading opportunities...</div>
          )}

          {!oppsLoading && (
            <div className="text-sm text-gray-600">
              Total opportunities: {oppsTotal}
            </div>
          )}

          {!oppsLoading && opps.length === 0 && (
            <div className="text-gray-600">No opportunities found.</div>
          )}

          {!oppsLoading && opps.length > 0 && (
            <div className="overflow-x-auto border rounded bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left px-4 py-3">Title</th>
                    <th className="text-left px-4 py-3">Organization</th>
                    <th className="text-left px-4 py-3">Location</th>
                    <th className="text-left px-4 py-3">Created</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {opps.map((opportunity) => (
                    <tr
                      key={opportunity.opportunityId}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">{opportunity.title}</td>
                      <td className="px-4 py-3">
                        {opportunity.organization?.name ?? "Unknown"}
                      </td>
                      <td className="px-4 py-3">
                        {opportunity.location ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(opportunity.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {opportunity.status ?? "active"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {opportunity.status !== "suspended" ? (
                            <button
                              onClick={() =>
                                handleOpportunityStatusChange(
                                  opportunity.opportunityId,
                                  "suspend"
                                )
                              }
                              className="px-3 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleOpportunityStatusChange(
                                  opportunity.opportunityId,
                                  "unsuspend"
                                )
                              }
                              className="px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
                            >
                              Unsuspend
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleOpportunityModeration(
                                opportunity.opportunityId,
                                "remove"
                              )
                            }
                            className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
            <button
              disabled={oppsPage <= 1}
              onClick={() => setOppsPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded disabled:opacity-50 w-full sm:w-auto"
            >
              Previous
            </button>
            <span>
              Page {oppsPage} of {oppTotalPages}
            </span>
            <button
              disabled={oppsPage >= oppTotalPages}
              onClick={() => setOppsPage((p) => Math.min(oppTotalPages, p + 1))}
              className="px-3 py-1 border rounded disabled:opacity-50 w-full sm:w-auto"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {tab === "activity" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              value={activityActionFilter}
              onChange={(e) => setActivityActionFilter(e.target.value)}
              placeholder="Filter by action (e.g., admin.user)"
              className="border rounded px-3 py-2 w-full"
            />
            <input
              value={activityActorFilter}
              onChange={(e) => setActivityActorFilter(e.target.value)}
              placeholder="Actor user ID"
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          {activityError && (
            <div className="p-3 bg-red-50 text-red-700 rounded">
              {activityError}
            </div>
          )}

          {activityLoading && (
            <div className="text-gray-600">Loading activity logs...</div>
          )}

          {!activityLoading && (
            <div className="text-sm text-gray-600">
              Total log entries: {activityTotal}
            </div>
          )}

          {!activityLoading && activityLogs.length === 0 && (
            <div className="text-gray-600">No activity logs found.</div>
          )}

          {!activityLoading && activityLogs.length > 0 && (
            <div className="overflow-x-auto border rounded bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left px-4 py-3">Time</th>
                    <th className="text-left px-4 py-3">Action</th>
                    <th className="text-left px-4 py-3">Actor</th>
                    <th className="text-left px-4 py-3">Entity</th>
                    <th className="text-left px-4 py-3">Metadata</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogs.map((log) => (
                    <tr
                      key={log.activityLogId}
                      className="border-t hover:bg-gray-50 align-top"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{log.action}</td>
                      <td className="px-4 py-3">
                        {log.actor?.email ?? "System"}
                        {log.actor?.role ? ` (${log.actor.role})` : ""}
                      </td>
                      <td className="px-4 py-3">
                        {log.entityType ? `${log.entityType}#` : "—"}
                        {log.entityId ?? ""}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-xs break-words">
                        {log.metadata ? JSON.stringify(log.metadata) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
            <button
              disabled={activityPage <= 1}
              onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded disabled:opacity-50 w-full sm:w-auto"
            >
              Previous
            </button>
            <span>
              Page {activityPage} of {activityTotalPages}
            </span>
            <button
              disabled={activityPage >= activityTotalPages}
              onClick={() =>
                setActivityPage((p) => Math.min(activityTotalPages, p + 1))
              }
              className="px-3 py-1 border rounded disabled:opacity-50 w-full sm:w-auto"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
