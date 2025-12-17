import { useEffect, useState } from "react";
import { fetchOpportunityById } from "../api/opportunity.api";
import type { Opportunity } from "../components/OpportunityCard";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OpportunityApplicants from "../components/OpportunityApplicants";


export default function OpportunityDetails() {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchOpportunityById(Number(id)).then(setOpportunity);
    }
  }, [id]);

  if (!opportunity) return <div>Loading...</div>;

  const isOwner =
    user?.role === "organization" &&
    opportunity.organization?.userId === user.userId;

  return (
    <div className="max-w-5xl mx-auto mt-28 p-6">
      {/* BACK */}
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
          <span>📍 {opportunity.location ?? "No location provided"}</span>
          <span>
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

      {/* DESCRIPTION */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700">{opportunity.description}</p>
      </section>

      {/* ORGANIZATION */}
      <section className="bg-white p-5 rounded-xl shadow border mb-8">
        <h2 className="text-xl font-semibold mb-2">Organization</h2>
        <p className="font-medium">{opportunity.organization?.name}</p>
      </section>

      {/* APPLY BUTTON — volunteers only */}
      {user?.role === "volunteer" && (
        <div className="flex justify-center mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl font-semibold shadow">
            Apply / Join Opportunity
          </button>
        </div>
      )}

      {/* ✅ APPLICANTS — ONLY OWNER ORGANIZATION */}
      {isOwner && (
        <section className="bg-white p-5 rounded-xl shadow border mt-10">
          <h2 className="text-xl font-semibold mb-4">Applicants</h2>
          <OpportunityApplicants
            opportunityId={opportunity.opportunityId}
          />
        </section>
      )}
    </div>
  );
}
