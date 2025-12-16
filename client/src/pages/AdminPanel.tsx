import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  fetchPendingOrganizations,
  fetchReportedOpportunities,
  moderateOpportunity,
  reviewOrganization,
  type Organization,
  type ReportedOpportunity,
} from "../api/admin.api";

type Tab = "organizations" | "reports";

export default function AdminPanel() {
  const { token } = useAuth();
  const authToken = useMemo(() => token ?? "", [token]);

  const [tab, setTab] = useState<Tab>("organizations");

  const [pendingOrgs, setPendingOrgs] = useState<Organization[]>([]);
  const [reportedOpps, setReportedOpps] = useState<ReportedOpportunity[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!authToken) return;

    setLoading(true);
    setError(null);

    try {
      const [orgs, opps] = await Promise.all([
        fetchPendingOrganizations(authToken),
        fetchReportedOpportunities(authToken),
      ]);

      setPendingOrgs(orgs);
      setReportedOpps(opps);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  const handleOrgReview = async (organizationId: number, decision: "accept" | "reject") => {
    try {
      await reviewOrganization(authToken, organizationId, decision);
      setPendingOrgs((prev) => prev.filter((o) => o.organizationId !== organizationId));
    } catch (e: any) {
      alert(e?.message ?? "Organization review failed");
    }
  };

  const handleOpportunityModeration = async (opportunityId: number, decision: "keep" | "remove") => {
    try {
      await moderateOpportunity(authToken, opportunityId, decision);
      setReportedOpps((prev) => prev.filter((x) => x.opportunity.opportunityId !== opportunityId));
    } catch (e: any) {
      alert(e?.message ?? "Moderation failed");
    }
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto mt-28 p-6">Loading admin panel...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-28 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Moderate reported opportunities and verify organizations.</p>
        </div>

        <button
          onClick={load}
          className="px-4 py-2 rounded border bg-white hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 border rounded bg-red-50 text-red-800">{error}</div>
      )}

      <div className="mt-8 flex gap-2">
        <button
          onClick={() => setTab("organizations")}
          className={`px-4 py-2 rounded border ${tab === "organizations" ? "bg-blue-600 text-white" : "bg-white"}`}
        >
          Pending Organizations ({pendingOrgs.length})
        </button>
        <button
          onClick={() => setTab("reports")}
          className={`px-4 py-2 rounded border ${tab === "reports" ? "bg-blue-600 text-white" : "bg-white"}`}
        >
          Reported Opportunities ({reportedOpps.length})
        </button>
      </div>

      {tab === "organizations" && (
        <section className="mt-6 space-y-4">
          {pendingOrgs.length === 0 ? (
            <div className="text-gray-600">No organizations awaiting verification.</div>
          ) : (
            pendingOrgs.map((org) => (
              <div key={org.organizationId} className="border rounded p-4 bg-white">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">{org.name}</div>
                    <div className="text-sm text-gray-600">Email: {org.user?.email ?? "(unknown)"}</div>
                    {org.description && <div className="mt-2 text-gray-700">{org.description}</div>}
                    <div className="mt-2 text-sm text-gray-500">Created: {new Date(org.createdAt).toLocaleString()}</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOrgReview(org.organizationId, "accept")}
                      className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => handleOrgReview(org.organizationId, "reject")}
                      className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {tab === "reports" && (
        <section className="mt-6 space-y-4">
          {reportedOpps.length === 0 ? (
            <div className="text-gray-600">No reported opportunities.</div>
          ) : (
            reportedOpps.map((item) => {
              const opp = item.opportunity;
              return (
                <div key={opp.opportunityId} className="border rounded p-4 bg-white">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold">
                        #{opp.opportunityId} — {opp.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        Organization: {opp.organization?.name ?? "(unknown)"}
                        {opp.organization?.user?.email ? ` (${opp.organization.user.email})` : ""}
                      </div>
                      <div className="mt-2 text-gray-700">{opp.description}</div>
                      <div className="mt-2 text-sm text-gray-500">Reports: {item.reportCount}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpportunityModeration(opp.opportunityId, "keep")}
                        className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                      >
                        Keep
                      </button>
                      <button
                        onClick={() => handleOpportunityModeration(opp.opportunityId, "remove")}
                        className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-blue-700">View reports</summary>
                    <div className="mt-3 space-y-3">
                      {item.reports.map((r) => (
                        <div key={r.reportId} className="border rounded p-3 bg-gray-50">
                          <div className="text-sm text-gray-600">
                            Report #{r.reportId} — {new Date(r.createdAt).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            Reporter: {r.volunteer?.fullName ?? "Volunteer"}
                            {r.volunteer?.user?.email ? ` (${r.volunteer.user.email})` : ""}
                          </div>
                          <div className="mt-2 text-gray-800">{r.content}</div>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              );
            })
          )}
        </section>
      )}
    </div>
  );
}
