import PendingOrganization from "../components/pendingVerification";
import { getPendingOrganizations, verifyOrganization } from "../api/verification.api";
import { useEffect, useState } from "react";

interface Organization {
  organizationId: number;
  email: string;
  name: string;
  description: string;
}

export default function AdminPanel() {
  const [pendingOrgs, setPendingOrgs] = useState<Organization[]>([]);

  useEffect(() => {
    loadPending();
  }, []);

  async function loadPending() {
    const data = await getPendingOrganizations();
    setPendingOrgs(data);
  }

  async function handleVerify(id: number) {
    await verifyOrganization(id);

    setPendingOrgs((prev) => prev.filter(org => org.organizationId !== id));
  }
  // every organization creates one component
  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-bold mb-4">Pending Organizations</h1>

      {pendingOrgs.length === 0 && <p>No pending organizations 🎉</p>}

      {pendingOrgs.map(org => (
        <PendingOrganization
          key={org.organizationId} 
          org={org} 
          onVerify={handleVerify} 
        />
      ))}
    </div>
  );
}
