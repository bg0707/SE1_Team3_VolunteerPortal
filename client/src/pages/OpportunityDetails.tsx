import { useEffect, useState } from "react";
import { fetchOpportunityById } from "../api/opportunity.api";
import type { Opportunity } from "../components/OpportunityCard";
import { useParams, useNavigate } from "react-router-dom";

import { applyToOpportunity } from "../api/applications.api";
import { useAuth } from "../context/AuthContext";
import { fetchApplicationsByVolunteer } from "../api/applications.api";

export default function OpportunityDetails() {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user } = useAuth(); // Logged-in user
  const [hasApplied, setHasApplied] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      // Load the opportunity
      fetchOpportunityById(parseInt(id)).then(setOpportunity);

      // Load user's applications to see if this opportunity is applied
      if (user?.role === "volunteer") {
        const apps = await fetchApplicationsByVolunteer(user.userId);
        const applied = apps.some(
          (app) => app.opportunity.opportunityId === parseInt(id)
        );
        setAlreadyApplied(applied);
      }
    };

    loadData();
  }, [id, user]);

  if (!opportunity) return <div>Loading...</div>;

  // apply handler
  const handleApply = async () => {
    if (!user) {
      alert("You must be logged in to apply.");
      return navigate("/login");
    }

    if (user.role !== "volunteer") {
      return alert("Only volunteers can apply to an opportunity.");
    }

    try {
      const res = await applyToOpportunity(
        user.userId, // volunteerId
        opportunity.opportunityId
      );

      alert("Application submitted!");
      console.log("Application response:", res);

      setHasApplied(true);

      // Redirect to My Applications
      //navigate("/my-applications");
    } catch (err) {
      console.error("Error applying:", err);
      alert("Failed to apply. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-28 p-6">
      {/* back arrow*/}
      <button
        onClick={() => navigate("/opportunities")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        ← Back
      </button>

      {/* header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">{opportunity.title}</h1>

        <div className="mt-4 flex flex-wrap gap-4 text-gray-600">
          <span className="flex items-center gap-1">
            📍 {opportunity.location ?? "No location provided"}
          </span>

          <span className="flex items-center gap-1">
            📅{" "}
            {opportunity.date
              ? new Date(opportunity.date).toLocaleDateString()
              : "No date provided"}
          </span>

          {opportunity.category?.name && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              {opportunity.category.name}
            </span>
          )}
        </div>
      </div>

      {/* grid layout  */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr] gap-10">
        <div className="space-y-8">
          {/* description */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {opportunity.description}
            </p>
          </section>

          {/* organization */}
          <section className="bg-white p-5 rounded-xl shadow border">
            <h2 className="text-xl font-semibold mb-2">Organization</h2>
            <p className="font-medium">{opportunity.organization?.name}</p>
          </section>

          {/* details */}
          <section className="bg-white p-5 rounded-xl shadow border">
            <h2 className="text-xl font-semibold mb-4">Details</h2>

            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">ID:</span>{" "}
                {opportunity.opportunityId}
              </p>
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {opportunity.location ?? "No location provided"}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {opportunity.date
                  ? new Date(opportunity.date).toLocaleDateString()
                  : "No date provided"}
              </p>
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {opportunity.category?.name ?? "No category"}
              </p>
              <p>
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(opportunity.createdAt).toLocaleString()}
              </p>
            </div>
          </section>

          {/* apply button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleApply}
              disabled={alreadyApplied}
              className={`py-3 px-8 rounded-xl font-semibold shadow text-white 
                ${
                  alreadyApplied
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                  }`}
            >
              {alreadyApplied ? "Already Applied" : "Apply / Join Opportunity"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
