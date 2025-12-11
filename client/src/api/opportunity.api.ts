import type { Opportunity } from "../components/OpportunityCard";

const API_URL = "http://localhost:3001/opportunities";

// Function to fetch all the opportunities based on different filets if any 
export async function fetchOpportunities(filters: Record<string, any>): Promise<Opportunity[]> {
  const params = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_URL}?${params}`);
  return response.json();
}

// fetch the opportunity based on a specific id 
export async function fetchOpportunityById(id: number): Promise<Opportunity> {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
}

export interface CreateOpportunity {
  title: string;
  description: string;
  location?: string;
  date?: string; // ISO date string
  categoryId?: number;
}

export async function createOpportunity(
  opportunity: CreateOpportunity,
  token: string
): Promise<Opportunity> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include JWT token for authentication
    },
    body: JSON.stringify(opportunity),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create opportunity");
  }

  const result = await response.json();
  return result.opportunity; // Return the opportunity from the response
}

// Get all opportunities for the authenticated organization
export async function fetchMyOpportunities(token: string): Promise<Opportunity[]> {
  const response = await fetch(`${API_URL}/my-opportunities`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch my opportunities");
  }

  return response.json();
}

// Update an opportunity
export async function updateOpportunity(
  opportunityId: number,
  opportunity: CreateOpportunity,
  token: string
): Promise<Opportunity> {
  const response = await fetch(`${API_URL}/${opportunityId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(opportunity),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update opportunity");
  }

  const result = await response.json();
  return result.opportunity;
}

// Delete an opportunity
export async function deleteOpportunity(
  opportunityId: number,
  token: string
): Promise<void> {
  const response = await fetch(`${API_URL}/${opportunityId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete opportunity");
  }
}