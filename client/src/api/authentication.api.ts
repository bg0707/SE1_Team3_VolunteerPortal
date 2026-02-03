import { API_BASE_URL } from "../config/api";

// Centralized auth endpoint root.
const API_URL = `${API_BASE_URL}/authentication`;

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    userId: number;
    email: string;
    role: string;
    createdAt: Date;
    isVerified: boolean;
  };
}


// LOGIN
export async function login(email: string, password: string): Promise<LoginResponse> {
  // Returns a JWT token + user payload on success.
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
  description?: string,

): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/register/organization`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, organizationName, description}),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Organization registration failed");
  }

  return response.json();
}

// REQUEST PASSWORD RESET (
export async function requestPasswordReset(email: string) {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Password reset request failed");
  }

  // Return the reset token directly (useful for dev/testing).
  return response.json(); 
}

// RESET PASSWORD
export async function resetPassword(token: string, newPassword: string) {
  const response = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Password reset failed");
  }

  return response.json();
}
