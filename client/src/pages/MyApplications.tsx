import { useEffect, useState } from "react";
import ApplicationCard from "../components/ApplicationCard";
import type { Application } from "../api/applications.api";
import { fetchApplicationsByVolunteer } from "../api/applications.api";

const MyApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // TEMPORARY — will be replaced by AuthContext later
  const volunteerId = Number(localStorage.getItem("volunteerId"));

  useEffect(() => {
    const loadApps = async () => {
      try {
        const data = await fetchApplicationsByVolunteer(volunteerId);
        setApplications(data);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, [volunteerId]);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">Loading applications...</p>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>

      {applications.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">
          You have not applied to any opportunities yet.
        </p>
      ) : (
        applications.map((app) => (
          <ApplicationCard key={app.applicationId} application={app} />
        ))
      )}
    </div>
  );
};

export default MyApplications;
