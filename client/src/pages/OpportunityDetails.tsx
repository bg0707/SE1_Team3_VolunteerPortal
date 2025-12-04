import { useEffect, useState } from "react";
import { fetchOpportunityById } from "../api/opportunity.api";
import type { Opportunity } from "../components/OpportunityCard";
import { useParams, useNavigate } from "react-router-dom";

export default function OpportunityDetails() {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchOpportunityById(parseInt(id)).then(setOpportunity);
    }
  }, [id]);

  if (!opportunity) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-28 p-6">
      {/* BACK ARROW */}
      <button
        onClick={() => navigate("/opportunities")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        ← Back
      </button>

      {/* HEADER */}
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

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr] gap-10">
        <div className="space-y-8">
          {/* DESCRIPTION */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {opportunity.description}
            </p>
          </section>

          {/* ORGANIZATION */}
          <section className="bg-white p-5 rounded-xl shadow border">
            <h2 className="text-xl font-semibold mb-2">Organization</h2>
            <p className="font-medium">{opportunity.organization?.name}</p>
          </section>

          {/* DETAILS */}
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

          {/* CENTERED APPLY BUTTON */}
          <div className="flex justify-center mt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl font-semibold shadow">
              Apply / Join Opportunity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
