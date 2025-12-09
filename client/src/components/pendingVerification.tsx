interface Organization {
  organizationId: number;
  email: string;
  organizationName: string;
  description: string;
}

interface Props {
  org: Organization;
  onVerify: (id: number) => void;
}

export default function PendingOrganization({ org, onVerify }: Props) {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white flex justify-between items-center mb-3">

      <div>
        <h2 className="font-bold text-lg">{org.organizationName}</h2>
        <p className="text-gray-600 text-sm">{org.email}</p>
        <p className="text-gray-800 mt-1">{org.description}</p>
      </div>

      <button
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        onClick={() => onVerify(org.organizationId)}
      >
        Verify
      </button>

    </div>
  );
}
