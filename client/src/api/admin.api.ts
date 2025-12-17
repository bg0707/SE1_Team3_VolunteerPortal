const API_URL = "http://localhost:3001/admin";

export interface User {
  userId: number;
  email: string;
}

export interface Organization {
  organizationId: number;
  name: string;
  description?: string | null;
  isVerified: boolean;
  createdAt: string;
  user?: User;
}

export interface Volunteer {
  volunteerId: number;
  fullName: string;
  user?: User;
}

export interface Opportunity {
  opportunityId: number;
  title: string;
  description: string;
  location?: string | null;
  date?: string | null;
  createdAt: string;
  organization?: Organization;
}

export interface Report {
  reportId: number;
  content: string;
  createdAt: string;
  volunteer?: Volunteer;
}

export interface ReportedOpportunity {
  opportunity: Opportunity;
  reportCount: number;
  reports: Report[];
}

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchReportedOpportunities(token: string): Promise<ReportedOpportunity[]> {
  const res = await fetch(`${API_URL}/reported-opportunities`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch reported opportunities");
  }

  return res.json();
}

export async function moderateOpportunity(
  token: string,
  opportunityId: number,
  decision: "keep" | "remove"
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/opportunities/${opportunityId}/moderate`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ decision }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Moderation action failed");
  }

  return res.json();
}

export async function fetchPendingOrganizations(token: string): Promise<Organization[]> {
  const res = await fetch(`${API_URL}/organizations/pending`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch pending organizations");
  }

  return res.json();
}

export async function reviewOrganization(
  token: string,
  organizationId: number,
  decision: "accept" | "reject"
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/organizations/${organizationId}/review`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ decision }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Organization review failed");
  }

  return res.json();
}
