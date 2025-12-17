export interface Category {
  categoryId: number;
  name: string;
}

const BASE_URL = "http://localhost:3001";

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}
