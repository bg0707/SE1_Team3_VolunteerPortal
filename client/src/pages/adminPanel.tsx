import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import PendingOrganization from "../components/pendingVerification";
import { getPendingOrganizations, verifyOrganization } from "../api/verification.api";
// Importing the reports-specific logic from your colleague's API file
import { 
  fetchReportedOpportunities, 
  moderateOpportunity, 
  type ReportedOpportunity 
} from "../api/admin.api";

type Tab = "organizations" | "reports";

interface Organization {
  organizationId: number;
  email: string;
  name: string;
  description: string;
}

export default function AdminPanel() {
  const { token } = useAuth();
  const authToken = useMemo(() => token ?? "", [token]);

  // State management
  const [tab, setTab] = useState<Tab>("organizations");
  const [pendingOrgs, setPendingOrgs] = useState<Organization[]>([]);
  const [reportedOpps, setReportedOpps] = useState<ReportedOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unified load function to fetch both datasets
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [orgs, opps] = await Promise.all([
        getPendingOrganizations(),
        authToken ? fetchReportedOpportunities(authToken) : Promise.resolve([])
      ]);
      setPendingOrgs(orgs);
      setReportedOpps(opps);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [authToken]);

  // Your original handler
  async function handleVerify(id: number) {
    try {
      await verifyOrganization(id);
      setPendingOrgs((prev) => prev.filter(org => org.organizationId !== id));
    } catch (e: any) {
      alert("Verification failed");
    }
  }

  // New handler for reports
  const handleOpportunityModeration = async (opportunityId: number, decision: "keep" | "remove") => {
    try {
      await moderateOpportunity(authToken, opportunityId, decision);
      setReportedOpps((prev) => prev.filter((x) => x.opportunity.opportunityId !== opportunityId));
    } catch (e: any) {
      alert(e?.message ?? "Moderation failed");
    }
  };

  if (loading) return <div className="p-6 mt-20 text-center text-gray-600">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-20 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button onClick={loadData} className="px-4 py-2 border rounded hover:bg-gray-50">Refresh</button>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-800 rounded">{error}</div>}

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8">
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

      {/* Tab Content: Organizations (Your Original Logic) */}
      {tab === "organizations" && (
        <div className="space-y-4">
          {pendingOrgs.length === 0 && <p className="text-gray-600">No pending organizations 🎉</p>}
          {pendingOrgs.map(org => (
            <PendingOrganization
              key={org.organizationId} 
              org={org} 
              onVerify={handleVerify} 
            />
          ))}
        </div>
      )}

      {/* Tab Content: Reports (Your Colleague's Logic) */}
      {tab === "reports" && (
        <section className="space-y-4">
          {reportedOpps.length === 0 ? (
            <div className="text-gray-600">No reported opportunities.</div>
          ) : (
            reportedOpps.map((item) => (
              <div key={item.opportunity.opportunityId} className="border rounded p-4 bg-white shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">#{item.opportunity.opportunityId} — {item.opportunity.title}</div>
                    <div className="text-sm text-gray-600">Reports: {item.reportCount}</div>
                    <div className="mt-2 text-gray-700">{item.opportunity.description}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpportunityModeration(item.opportunity.opportunityId, "keep")}
                      className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm"
                    >
                      Keep
                    </button>
                    <button
                      onClick={() => handleOpportunityModeration(item.opportunity.opportunityId, "remove")}
                      className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-blue-700">View Detail Reports</summary>
                  <div className="mt-3 space-y-2">
                    {item.reports.map((r) => (
                      <div key={r.reportId} className="text-sm border-t pt-2 mt-2">
                        <span className="font-semibold text-gray-500">Reason:</span> {r.content}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
}