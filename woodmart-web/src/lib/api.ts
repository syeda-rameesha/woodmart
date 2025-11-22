// woodmart-web/src/lib/api.ts
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;

  try {
    const res = await fetch(url, {
      ...init,
      // keep headers simple; accept caller overrides
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      // you generally don't need credentials for a public GET
      // credentials: "include",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`API ${res.status} ${res.statusText} – ${text}`);
    }
    return res.json() as Promise<T>;
  } catch (err: any) {
    console.error("Fetch error ->", { url, message: err?.message });
    throw err;
  }
}