
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

// Fetch details of a single application
export async function fetchApplicationById(applicationId: number): Promise<Application> {
  const response = await fetch(`${API_URL}/${applicationId}`);
  return response.json();
}

// Cancel application
export async function cancelApplication(applicationId: number, reason?: string): Promise<Application> {
  const response = await fetch(`${API_URL}/${applicationId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });

  return response.json();
}

// Update application data
export async function updateApplication(applicationId: number, data: Record<string, any>): Promise<Application> {
  const response = await fetch(`${API_URL}/${applicationId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
}