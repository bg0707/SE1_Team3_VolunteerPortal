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