
const API_URL = "http://localhost:3001/applications";


export interface Organization {
  name: string;
}

export interface Opportunity {
  opportunityId: number;
  title: string;
  description: string;
  location: string | null;
  date: string;
  organization: Organization;
}

export interface Application {
  applicationId: number;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  opportunity: Opportunity;
}

// Fetch all applications for a volunteer 
export async function fetchApplicationsByVolunteer(volunteerId: number): Promise<Application[]> {
  const response = await fetch(`${API_URL}/volunteer/${volunteerId}`);
  return response.json();
}

// Apply to an opportunity
export async function applyToOpportunity(volunteerId: number, opportunityId: number): Promise<Application> {
  const response = await fetch(`${API_URL}/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ volunteerId, opportunityId }),
  });

  return response.json();
}

