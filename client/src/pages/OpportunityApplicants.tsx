import { useEffect, useState } from "react";
import { fetchApplicationsByOpportunity, reviewApplication } from "../api/applications.api";
import type { Application } from "../api/applications.api";

export default function OpportunityApplicants({ opportunityId }: { opportunityId: number }) {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await fetchApplicationsByOpportunity(opportunityId);
      setApps(data);
      setLoading(false);
    })();
  }, [opportunityId]);

  const handleReview = async (applicationId: number, decision: "accepted" | "rejected") => {
    const result = await reviewApplication(applicationId, decision);
    setApps((prev) =>
      prev.map((a) => (a.applicationId === applicationId ? { ...a, status: result.application.status } : a))
    );
  };

  if (loading) return <p className="mt-6 text-gray-500">Loading...</p>;

  return (
    <div className="space-y-3">
      {apps.map((app) => (
        <div key={app.applicationId} className="border rounded p-4 flex justify-between items-center">
          <div>
            <div className="font-semibold">{app.volunteer?.fullName ?? "Volunteer"}</div>
            <div className="text-sm text-gray-600">{app.volunteer?.user?.email}</div>
            <div className="text-sm text-gray-600">
              Applied: {new Date(app.createdAt).toLocaleString()} — Status: {app.status}
            </div>
          </div>
          <div className="space-x-2">
            <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => handleReview(app.applicationId, "accepted")}>
              Approve
            </button>
            <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => handleReview(app.applicationId, "rejected")}>
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}