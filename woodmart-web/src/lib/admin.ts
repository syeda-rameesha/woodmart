const API = process.env.NEXT_PUBLIC_API_URL || "woodmart-production.up.railway.app";

export async function adminFetch(path: string, token: string, init?: RequestInit) {
  const r = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {})
    }
  });
  return r.json();
}