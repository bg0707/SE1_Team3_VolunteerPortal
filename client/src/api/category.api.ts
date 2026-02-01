import { API_BASE_URL } from "../config/api";

export interface Category {
  categoryId: number;
  name: string;
}

const BASE_URL = API_BASE_URL;

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}
