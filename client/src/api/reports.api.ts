const API_URL = "http://localhost:3001/reports";

export async function submitReport(token: string, opportunityId: number, content: string) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ opportunityId, content }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to submit report");
  }

  return res.json();
}
