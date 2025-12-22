// woodmart-web/src/lib/api.ts
// Copy — paste this exact file (TypeScript). If your project uses .js, remove type annotations.

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "woodmart-production.up.railway.app";

/**
 * Simple wrapper around fetch that throws on non-OK,
 * and returns parsed JSON when ok.
 */
export default async function api<T = any>(url: string, init?: RequestInit): Promise<T> {
  const full = url.startsWith("http") ? url : `${API_BASE}${url}`;
  try {
    const res = await fetch(full, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      // try to read body for error details
      let body: any = null;
      try { body = await res.json(); } catch (e) { body = await res.text().catch(()=>null); }
      const msg = body?.message || body?.error || `Request failed (${res.status})`;
      const err: any = new Error(msg);
      err.status = res.status;
      err.body = body;
      throw err;
    }

    // If response body is empty, return empty object
    const text = await res.text();
    if (!text) return {} as T;
    return JSON.parse(text) as T;
  } catch (err: any) {
    console.error("Fetch error ->", { url: full, message: err?.message, err });
    throw err;
  }
}