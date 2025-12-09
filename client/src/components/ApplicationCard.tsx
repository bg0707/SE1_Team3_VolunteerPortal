import type { Application } from "../api/applications.api";

interface Props {
  application: Application;
}

const ApplicationCard = ({ application }: Props) => {
  const opport = application.opportunity;

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
        <span className="font-bold capitalize text-blue-600">
          {application.status}
        </span>
      </p>
    </div>
  );
};

export default ApplicationCard;
