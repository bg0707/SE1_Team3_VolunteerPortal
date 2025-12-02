import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { Application } from "../api/applications.api";
import {
  fetchApplicationById,
  cancelApplication,
  updateApplication,
} from "../api/applications.api";

import CancelApplicationModal from "../components/CancelApplicationModal";
import UpdateApplicationForm from "../components/UpdateApplicationForm";

const ApplicationDetails = () => {
  const { applicationId } = useParams<{ applicationId: string }>();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        if (!applicationId) return;

        const data = await fetchApplicationById(Number(applicationId));
        setApplication(data);
      } catch (err) {
        console.error("Failed to fetch application details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [applicationId]);

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (!application) return <p className="text-center text-red-500 mt-10">Application not found</p>;

  const opp = application.opportunity;

  // Handle cancel
  const handleCancel = async (reason?: string) => {
    try {
      const res = await cancelApplication(application.applicationId, reason);
      setApplication(res);
      setShowCancelModal(false);
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  // Handle update
  const handleUpdate = async (data: Record<string, any>) => {
    try {
      const res = await updateApplication(application.applicationId, data);
      setApplication(res);
      setShowUpdateForm(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{opp.title}</h1>

      <div className="space-y-3 text-gray-700">
        <p>
          <span className="font-medium">Organization:</span> {opp.organization.name}
        </p>
        <p>
          <span className="font-medium">Description:</span> {opp.description}
        </p>
        <p>
          <span className="font-medium">Location:</span> {opp.location || "Unknown"}
        </p>
        <p>
          <span className="font-medium">Date:</span>{" "}
          {new Date(opp.date).toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">Status:</span>{" "}
          <span className="font-semibold capitalize text-blue-600">{application.status}</span>
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setShowCancelModal(true)}
          className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Cancel Application
        </button>

        <button
          onClick={() => setShowUpdateForm(!showUpdateForm)}
          className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Update Information
        </button>
      </div>

      {/* Cancel modal */}
      <CancelApplicationModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
      />

      {/* Update form */}
      {showUpdateForm && (
        <UpdateApplicationForm
          initialNotes=""
          initialPreferences=""
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};

export default ApplicationDetails;
