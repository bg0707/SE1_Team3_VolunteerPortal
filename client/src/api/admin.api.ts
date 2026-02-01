import { API_BASE_URL } from "../config/api";

const API_URL = `${API_BASE_URL}/admin`;

export interface User {
  userId: number;
  email: string;
}

export interface UserSummary {
  userId: number;
  name: string;
  email: string;
  role: "volunteer" | "organization" | "admin";
  status: "active" | "suspended" | "deactivated";
  createdAt: string;
}

export interface UserDetails {
  user: UserSummary & { createdAt: string };
  volunteer?: {
    volunteerId: number;
    fullName: string;
    age?: number | null;
    createdAt: string;
  } | null;
  organization?: {
    organizationId: number;
    name: string;
    description?: string | null;
    isVerified: boolean;
    createdAt: string;
  } | null;
}

export interface Organization {
  organizationId: number;
  name: string;
  description?: string | null;
  isVerified: boolean;
  createdAt: string;
  user?: User;
}

export interface OrganizationSummary {
  organizationId: number;
  userId: number;
  name: string;
  email: string;
  description?: string | null;
  isVerified: boolean;
  userStatus: "active" | "suspended" | "deactivated";
  verificationStatus: "pending" | "verified" | "rejected";
  createdAt: string;
  opportunitiesCreated: number;
  applicationsReceived: number;
  volunteersApplied: number;
}

export interface OrganizationDetails {
  organizationId: number;
  userId: number;
  name: string;
  description?: string | null;
  isVerified: boolean;
  createdAt: string;
  user: {
    userId: number;
    email: string;
    status: "active" | "suspended" | "deactivated";
    createdAt: string;
  };
  opportunitiesCreated: number;
  applicationsReceived: number;
  volunteersApplied: number;
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
  imageUrl?: string | null;
  createdAt: string;
  organization?: Organization;
}

export interface AdminOpportunity {
  opportunityId: number;
  title: string;
  description: string;
  status?: "active" | "suspended";
  location?: string | null;
  date?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  organization?: {
    organizationId: number;
    name: string;
    user?: User;
  };
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

export interface ActivityLog {
  activityLogId: number;
  action: string;
  entityType?: string | null;
  entityId?: number | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  actor?: {
    userId: number;
    email: string;
    role: "volunteer" | "organization" | "admin";
  } | null;
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
  decision: "keep" | "remove" | "suspend" | "unsuspend",
  reason?: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/opportunities/${opportunityId}/moderate`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ decision, reason }),
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

export async function fetchUsers(
  token: string,
  options: {
    search?: string;
    role?: string;
    status?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ total: number; users: UserSummary[] }> {
  const params = new URLSearchParams();
  if (options.search) params.set("search", options.search);
  if (options.role) params.set("role", options.role);
  if (options.status) params.set("status", options.status);
  if (options.limit) params.set("limit", String(options.limit));
  if (options.offset) params.set("offset", String(options.offset));

  const res = await fetch(`${API_URL}/users?${params.toString()}`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch users");
  }

  return res.json();
}

export async function fetchUserDetails(
  token: string,
  userId: number
): Promise<UserDetails> {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch user details");
  }

  return res.json();
}

export async function updateUserStatus(
  token: string,
  userId: number,
  status: "active" | "suspended" | "deactivated"
) {
  const res = await fetch(`${API_URL}/users/${userId}/status`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to update user status");
  }

  return res.json();
}

export async function fetchOrganizations(
  token: string,
  options: {
    search?: string;
    verificationStatus?: "pending" | "verified" | "rejected";
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ total: number; organizations: OrganizationSummary[] }> {
  const params = new URLSearchParams();
  if (options.search) params.set("search", options.search);
  if (options.verificationStatus)
    params.set("verificationStatus", options.verificationStatus);
  if (options.limit) params.set("limit", String(options.limit));
  if (options.offset) params.set("offset", String(options.offset));

  const res = await fetch(`${API_URL}/organizations?${params.toString()}`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch organizations");
  }

  return res.json();
}

export async function fetchAllOpportunities(
  token: string,
  options: { limit?: number; offset?: number } = {}
): Promise<{ total: number; opportunities: AdminOpportunity[] }> {
  const params = new URLSearchParams();
  if (options.limit) params.set("limit", String(options.limit));
  if (options.offset) params.set("offset", String(options.offset));

  const res = await fetch(`${API_URL}/opportunities?${params.toString()}`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch opportunities");
  }

  return res.json();
}

export async function fetchActivityLogs(
  token: string,
  options: { action?: string; actorUserId?: number; limit?: number; offset?: number } = {}
): Promise<{ total: number; logs: ActivityLog[] }> {
  const params = new URLSearchParams();
  if (options.action) params.set("action", options.action);
  if (options.actorUserId) params.set("actorUserId", String(options.actorUserId));
  if (options.limit) params.set("limit", String(options.limit));
  if (options.offset) params.set("offset", String(options.offset));

  const res = await fetch(`${API_URL}/activity-logs?${params.toString()}`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch activity logs");
  }

  return res.json();
}

export async function fetchOrganizationDetails(
  token: string,
  organizationId: number
): Promise<OrganizationDetails> {
  const res = await fetch(`${API_URL}/organizations/${organizationId}`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch organization details");
  }

  return res.json();
}
