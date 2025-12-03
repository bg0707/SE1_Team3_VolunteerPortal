const API_URL = "http://localhost:3001/authentication";

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    userId: number;
    email: string;
    role: string;
  };
}


// LOGIN
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/login`, { 
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Invalid email or password");
  }

  return response.json();
}


// REGISTER VOLUNTEER
export async function registerVolunteer(
  email: string,
  password: string,
  fullName: string,
  age?: number
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/register/volunteer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, fullName, age }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Volunteer registration failed");
  }

  return response.json();
}


// REGISTER ORGANIZATION
export async function registerOrganization(
  email: string,
  password: string,
  organizationName: string,
  description?: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/register/organization`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, organizationName, description }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Organization registration failed");
  }

  return response.json();
}
