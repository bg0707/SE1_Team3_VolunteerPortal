import type { Application } from "../api/applications.api";

interface Props {
  application: Application;
  onCancel?: (applicationId: number) => void;
  cancelling?: boolean;
}

const ApplicationCard = ({ application, onCancel, cancelling }: Props) => {
  const opport = application.opportunity;
  const statusClass =
    application.status === "accepted"
      ? "text-green-600"
      : application.status === "rejected"
      ? "text-red-600"
      : application.status === "cancelled"
      ? "text-gray-500"
      : "text-blue-600";

  return (
    <div className="border border-gray-200 rounded-xl p-5 mb-4 shadow-sm bg-white">
      <h3 className="text-xl font-semibold mb-1">{opport.title}</h3>

      <p className="text-gray-600">
        <span className="font-medium">Organization:</span>{" "}
        {opport.organization.name}
      </p>

      <p className="text-gray-600">
        <span className="font-medium">Date:</span>{" "}
        {new Date(opport.date).toLocaleDateString()}
      </p>

      <p className="mt-2">
      <span className="font-medium">Status:</span>{" "}
        <span className={`font-bold capitalize ${statusClass}`}>
          {application.status}
        </span>
      </p>

      {["pending", "accepted"].includes(application.status) && onCancel && (
        <div className="mt-4">
          <button
            onClick={() => onCancel(application.applicationId)}
            disabled={cancelling}
            className={`px-4 py-2 rounded border ${
              cancelling
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-red-600 border-red-200 hover:bg-red-50"
            }`}
          >
            {cancelling ? "Cancelling..." : "Cancel Application"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
