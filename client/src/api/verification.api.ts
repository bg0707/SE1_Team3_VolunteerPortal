import { API_BASE_URL } from "../config/api";

const API_URL = `${API_BASE_URL}/admin`;

// GET pending organizations
export async function getPendingOrganizations(token: string) {
  const response = await fetch(`${API_URL}/organizations/pending`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load pending organizations");
  }

  return response.json();
}


// VERIFY organization
export async function verifyOrganization(id: number, token: string) {
  const response = await fetch(
    `${API_URL}/organizations/${id}/review`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ decision: "accept" }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to verify organization");
  }

  return response.json();
}
