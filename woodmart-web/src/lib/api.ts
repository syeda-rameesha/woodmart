const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://woodmart-production.up.railway.app/api";

export default async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}