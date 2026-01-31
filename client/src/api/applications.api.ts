const API_URL = "http://localhost:3001/applications";

export interface Organization {
  organizationId: number;
  name: string;
  userId: number; 
}


export interface Opportunity {
  opportunityId: number;
  title: string;
  description: string;
  location: string | null;
  date: string;
  imageUrl?: string | null;
  organization: Organization;
}

export interface User {
  userId: number;
  email: string;
}

export interface Volunteer {
  volunteerId: number;
  fullName: string;
  user: User;
}

export interface Application {
  applicationId: number;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  opportunity?: Opportunity;
  volunteer?: Volunteer;
}


export async function fetchApplicationsByOpportunity(
  opportunityId: number,
  token: string
): Promise<Application[]> {
  const res = await fetch(`${API_URL}/opportunity/${opportunityId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch applications");
  }

  return res.json();
}

export async function reviewApplication(
  applicationId: number,
  decision: "accepted" | "rejected",
  token: string
) {
  const res = await fetch(`${API_URL}/${applicationId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ decision }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to review application");
  }

  return res.json();
}


export async function fetchApplicationsByVolunteer(
  volunteerId: number,
  token?: string
): Promise<Application[]> {
  const res = await fetch(`${API_URL}/volunteer/${volunteerId}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch applications");
  }

  return res.json();
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

export async function cancelApplication(
  applicationId: number,
  token: string
): Promise<{ message: string; application: Application }> {
  const res = await fetch(`${API_URL}/${applicationId}/cancel`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to cancel application");
  }

  return res.json();
}
