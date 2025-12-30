const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://woodmart-production.up.railway.app/api";

export default async function api<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}