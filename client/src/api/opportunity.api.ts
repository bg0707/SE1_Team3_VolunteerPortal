import type { Opportunity } from "../components/OpportunityCard";
import { API_BASE_URL } from "../config/api";

const BASE_URL = API_BASE_URL;
const API_URL = `${BASE_URL}/opportunities`;


// Helper: Authorization headers
function authHeaders(token?: string, isFormData = false): HeadersInit {
  const headers: HeadersInit = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/* =========================
   Fetch all opportunities (public)
   ========================= */
export async function fetchOpportunities(
  filters: Record<string, any> = {}
): Promise<Opportunity[]> {
  const params = new URLSearchParams(
    Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])
  ).toString();

  const response = await fetch(`${API_URL}?${params}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch opportunities");
  }

  return response.json();
}

/* =========================
   Fetch opportunity by ID (public)
   ========================= */
export async function fetchOpportunityById(id: number): Promise<Opportunity> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch opportunity");
  }

  return response.json();
}

/* =========================
   Types
   ========================= */
export interface CreateOpportunity {
  title: string;
  description: string;
  location?: string;
  date?: string;
  categoryId?: number;
}

/* =========================
   Create opportunity (organization)
   ========================= */
export async function createOpportunity(
  opportunity: CreateOpportunity | FormData,
  token?: string
): Promise<Opportunity> {
  const isFormData = opportunity instanceof FormData;
  const response = await fetch(API_URL, {
    method: "POST",
    headers: authHeaders(token, isFormData),
    body: isFormData ? opportunity : JSON.stringify(opportunity),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create opportunity");
  }

  const result = await response.json();
  return result.opportunity;
}

/* =========================
   Fetch my opportunities (organization)
   ========================= */
export async function fetchMyOpportunities(
  token?: string
): Promise<Opportunity[]> {
  const response = await fetch(`${API_URL}/my-opportunities`, {
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch my opportunities");
  }

  return response.json();
}

/* =========================
   Update opportunity (organization)
   ========================= */
export async function updateOpportunity(
  opportunityId: number,
  opportunity: CreateOpportunity | FormData,
  token?: string
): Promise<Opportunity> {
  const isFormData = opportunity instanceof FormData;
  const response = await fetch(`${API_URL}/${opportunityId}`, {
    method: "PUT",
    headers: authHeaders(token, isFormData),
    body: isFormData ? opportunity : JSON.stringify(opportunity),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update opportunity");
  }

  const result = await response.json();
  return result.opportunity;
}

/* =========================
   Delete opportunity (organization)
   ========================= */
export async function deleteOpportunity(
  opportunityId: number,
  token?: string
): Promise<void> {
  const response = await fetch(`${API_URL}/${opportunityId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete opportunity");
  }
}
