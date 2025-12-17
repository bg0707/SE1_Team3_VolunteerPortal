import { useEffect, useState } from "react";
import {
  fetchApplicationsByOpportunity,
  reviewApplication,
  type Application,
} from "../api/applications.api";
import { useAuth } from "../context/AuthContext";

export default function OpportunityApplicants({
  opportunityId,
}: {
  opportunityId: number;
}) {
  const { token } = useAuth();

  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchApplicationsByOpportunity(
          opportunityId,
          token
        );
        setApps(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [opportunityId, token]);


  const handleReview = async (
    applicationId: number,
    decision: "accepted" | "rejected"
  ) => {
    if (!token) return;

    try {
      const result = await reviewApplication(
        applicationId,
        decision,
        token
      );

      setApps((prev) =>
        prev.map((a) =>
          a.applicationId === applicationId
            ? { ...a, status: result.application.status }
            : a
        )
      );
    } catch (err: any) {
      alert(err.message || "Failed to review application");
    }
  };


  if (loading) {
    return <p className="mt-6 text-gray-500">Loading applications...</p>;
  }

  if (error) {
    return (
      <p className="mt-6 text-red-600 font-medium">
        {error}
      </p>
    );
  }

  if (apps.length === 0) {
    return (
      <p className="mt-6 text-gray-500">
        No applications for this opportunity yet.
      </p>
    );
  }


  return (
    <div className="space-y-3">
      {apps.map((app) => (
        <div
          key={app.applicationId}
          className="border rounded-xl p-4 flex justify-between items-center"
        >
          <div>
            <div className="font-semibold">
              {app.volunteer?.fullName ?? "Volunteer"}
            </div>

            <div className="text-sm text-gray-600">
              {app.volunteer?.user?.email}
            </div>

            <div className="text-sm text-gray-600">
              Applied: {new Date(app.createdAt).toLocaleString()} — Status:{" "}
              <span className="font-medium capitalize">{app.status}</span>
            </div>
          </div>

          <div className="space-x-2">
            <button
              disabled={app.status !== "pending"}
              className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
              onClick={() =>
                handleReview(app.applicationId, "accepted")
              }
            >
              Approve
            </button>

            <button
              disabled={app.status !== "pending"}
              className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
              onClick={() =>
                handleReview(app.applicationId, "rejected")
              }
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}