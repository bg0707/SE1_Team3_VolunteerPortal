const API_URL = "http://localhost:3001/admin";

// GET pending organizations
export async function getPendingOrganizations() {
  const response = await fetch(`${API_URL}/organizations/pending`);

  if (!response.ok) {
    throw new Error("Failed to load pending organizations");
  }

  return response.json();
}

// VERIFY organization
export async function verifyOrganization(id: number) {
  const response = await fetch(`${API_URL}/organizations/verify/${id}`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Failed to verify organization");
  }

  return response.json();
}
