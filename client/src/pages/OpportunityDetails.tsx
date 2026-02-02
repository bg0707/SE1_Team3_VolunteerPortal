import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { fetchOpportunityById } from "../api/opportunity.api";
import { applyToOpportunity, fetchApplicationsByVolunteer } from "../api/applications.api";
import { submitReport } from "../api/reports.api";
import { ASSET_BASE_URL } from "../config/api";

import type { Opportunity } from "../components/OpportunityCard";
import OpportunityApplicants from "../components/OpportunityApplicants";

import { useAuth } from "../context/AuthContext";

export default function OpportunityDetails() {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const [showReport, setShowReport] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportSending, setReportSending] = useState(false);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();


  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      const opp = await fetchOpportunityById(Number(id));
      setOpportunity(opp);

      if (user?.role === "volunteer") {
        const apps = await fetchApplicationsByVolunteer(user.userId);
        setAlreadyApplied(
          apps.some(
            (app) =>
              app.opportunity?.opportunityId === Number(id) &&
              app.status !== "cancelled"
          )
        );
      }
    };

    loadData();
  }, [id, user]);

  if (!opportunity) return <div>Loading...</div>;

  const imageSrc = opportunity.imageUrl
    ? opportunity.imageUrl.startsWith("http")
      ? opportunity.imageUrl
      : `${ASSET_BASE_URL}${opportunity.imageUrl}`
    : "";

  const isOwner =
    user?.role === "organization" &&
    opportunity.organization?.userId === user.userId;


  const handleApply = async () => {
    if (!user) return navigate("/authentication");
    if (user.role !== "volunteer") return alert("Only volunteers can apply.");

    try {
      await applyToOpportunity(user.userId, opportunity.opportunityId);
      alert("Application submitted!");
      setAlreadyApplied(true);
    } catch {
      alert("Failed to apply.");
    }
  };


  const handleSubmitReport = async () => {
    if (!user || user.role !== "volunteer") return;
    if (!token || !reportText.trim()) return;

    try {
      setReportSending(true);
      await submitReport(token, opportunity.opportunityId, reportText.trim());
      alert("Report submitted.");
      setShowReport(false);
      setReportText("");
    } finally {
      setReportSending(false);
    }
  };


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
      <h1 className="text-4xl font-bold mb-4">{opportunity.title}</h1>

      {imageSrc && (
        <div className="w-full max-h-96 rounded-xl overflow-hidden mb-6 border">
          <img
            src={imageSrc}
            alt={opportunity.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-gray-600 mb-8">
        <span>📍 {opportunity.location ?? "No location"}</span>
        <span>📅 {new Date(opportunity.date).toLocaleDateString()}</span>
        {opportunity.category?.name && (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            {opportunity.category.name}
          </span>
        )}
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
        {opportunity.organization?.description && (
          <p className="mt-2 text-gray-600">
            {opportunity.organization.description}
          </p>
        )}
      </section>

      {/* APPLY */}
      {user?.role === "volunteer" && (
        <div className="flex justify-center mb-6">
          <button
            onClick={handleApply}
            disabled={alreadyApplied}
            className={`py-3 px-8 rounded-xl font-semibold text-white shadow ${
              alreadyApplied
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {alreadyApplied ? "Already Applied" : "Apply / Join Opportunity"}
          </button>
        </div>
      )}

      {/* REPORT */}
      {user?.role === "volunteer" && (
        <div className="text-center mb-10">
          <button
            onClick={() => setShowReport((s) => !s)}
            className="border px-4 py-2 rounded"
          >
            {showReport ? "Cancel Report" : "Report this listing"}
          </button>

          {showReport && (
            <div className="mt-4 border p-4 rounded">
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                className="w-full border rounded p-2"
                rows={4}
              />
              <button
                onClick={handleSubmitReport}
                disabled={reportSending}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded"
              >
                Submit Report
              </button>
            </div>
          )}
        </div>
      )}

      {/* APPLICANTS — OWNER ONLY */}
      {isOwner && (
        <section className="bg-white p-5 rounded-xl shadow border mt-10">
          <h2 className="text-xl font-semibold mb-4">Applicants</h2>
          <OpportunityApplicants opportunityId={opportunity.opportunityId} />
        </section>
      )}
    </div>
  );
}
