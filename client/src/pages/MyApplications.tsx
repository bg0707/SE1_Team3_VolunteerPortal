import { useEffect, useState } from "react";
import ApplicationCard from "../components/ApplicationCard";

import type { Application } from "../api/applications.api";
import { fetchApplicationsByVolunteer } from "../api/applications.api";

import { useAuth } from "../context/AuthContext";

const MyApplications = () => {
  const { user } = useAuth(); // ← Get logged-in user

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApps = async () => {
      try {
        // If user is not logged in OR not a volunteer → stop
        if (!user || user.role !== "volunteer") {
          setLoading(false);
          return;
        }

        const volunteerId = user.userId;

        const data = await fetchApplicationsByVolunteer(volunteerId);
        setApplications(data);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, [user]);

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading applications...
      </p>
    );
  }

  // Not logged in OR wrong role
  if (!user || user.role !== "volunteer") {
    return (
      <p className="text-center text-red-500 mt-10">
        You must be logged in as a volunteer to view applications.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 pt-24">
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
