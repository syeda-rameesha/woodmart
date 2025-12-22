// woodmart-web/src/lib/adminApi.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

/**
 * adminApi - small wrapper to call the backend API for admin endpoints.
 *
 * Usage:
 *   await adminApi("/orders", token, { method: "GET" });
 * or
 *   await adminApi("/orders", null, { method: "GET" }); // token auto-read from localStorage
 *
 * Returns parsed JSON on success, throws an Error on failure.
 */
export async function adminApi<T = any>(
  path: string,
  token?: string | null,
  init?: RequestInit
): Promise<T> {
  // resolve token (explicit param wins, otherwise try localStorage keys)
  if (!token && typeof window !== "undefined") {
    token = localStorage.getItem("admin_token") || localStorage.getItem("token") || null;
  }

  // Compose URL (allow caller to pass full URL if they want)
  const isFull = /^https?:\/\//i.test(path);
  const url = isFull ? path : `${API_BASE.replace(/\/api$/, "")}/api${path.startsWith("/") ? "" : "/"}${path}`;

  // Build fetch init
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init && (init as any).headers ? (init as any).headers : {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const cfg: RequestInit = {
    ...init,
    headers,
  };

  try {
    const res = await fetch(url, cfg);

    // try to parse body as json, but tolerate empty responses
    const text = await res.text();
    let body: any = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      // not JSON — keep raw text
      body = text;
    }

    if (!res.ok) {
      // build a helpful error
      const msg =
        (body && (body.message || body.error || (typeof body === "string" ? body : null))) ||
        `Request failed (${res.status})`;
      const err = new Error(msg);
      // @ts-ignore attach some helpful properties
      err.status = res.status;
      // @ts-ignore attach the parsed body for debugging
      err.body = body;
      throw err;
    }

    return body as T;
  } catch (err: any) {
    // normalize network / unexpected errors
    if (err && err.message && err.message.includes("No admin token")) {
      // rethrow as-is
      throw err;
    }
    const e = new Error(err?.message || "Fetch error");
    // @ts-ignore
    e.original = err;
    throw e;
  }
}

export default adminApi;