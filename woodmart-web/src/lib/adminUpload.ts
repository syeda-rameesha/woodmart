// woodmart-web/src/lib/adminUpload.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-undef */

/**
 * adminUpload(file, token?) => Promise<any>
 *
 * Tries several upload endpoints and returns the successful parsed response (or throws a clear Error).
 */

const API_BASE: string =
  (process.env.NEXT_PUBLIC_API_URL as string) || "woodmart-production.up.railway.app";

function getErrMsg(err: unknown): string {
  try {
    if (err === null || err === undefined) return String(err);
    if (typeof err === "string") return err;
    if (typeof err === "object") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e: any = err;
      if (e.message) return String(e.message);
      if (e.error) return String(e.error);
      if (e.body && (e.body.message || e.body.error)) {
        return String(e.body.message || e.body.error);
      }
      // If it's an object, try JSON
      try {
        return JSON.stringify(e);
      } catch {
        return String(e);
      }
    }
    return String(err);
  } catch {
    return "Unknown error";
  }
}

export default async function adminUpload(file: File, token?: string): Promise<any> {
  if (!file) {
    throw new Error("No file provided to upload");
  }

  const endpoints: string[] = [
    // 1) admin protected upload (recommended)
    `${API_BASE.replace(/\/$/, "")}/admin/upload`,
    // 2) public upload under /api
    `${API_BASE.replace(/\/$/, "")}/upload`,
    // 3) fallback to server-root /upload (if backend exposes it there)
    `${API_BASE.replace(/\/api$/, "")}/upload`,
  ];

  // Build FormData once (we will reuse the same file for each fetch)
  const formData = new FormData();
  formData.append("image", file);

  let lastErr: unknown = null;

  for (const url of endpoints) {
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(url, {
        method: "POST",
        body: formData,
        headers,
      });

      // Treat 404 specially (try next)
      if (res.status === 404) {
        lastErr = { message: `Not found: ${url}`, status: 404 };
        continue;
      }

      // Read body safely
      const text = await res.text();
      let body: any = null;
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        body = text;
      }

      if (!res.ok) {
        const errMsg =
          (body && (body.message || body.error)) ||
          `Upload failed -> ${res.status} ${res.statusText}`;
        // If auth problems, stop and throw immediately
        if (res.status === 401 || res.status === 403) {
          throw new Error(errMsg);
        }
        lastErr = { message: errMsg, status: res.status, body };
        continue;
      }

      // success: normalize returned structure
      const result = body || {};
      const out =
        result.url ||
        result.secure_url ||
        (result.body && (result.body.url || result.body.secure_url)) ||
        result;

      return out;
    } catch (err) {
      lastErr = err;

      const m = getErrMsg(err).toLowerCase();
      // If it looks like an authorization / API-key error, throw immediately
      if (
        m.includes("unauthoriz") ||
        m.includes("invalid token") ||
        m.includes("no token") ||
        m.includes("must supply api_key") ||
        m.includes("must supply api key")
      ) {
        throw new Error(getErrMsg(err));
      }

      // Otherwise continue to next endpoint
      continue;
    }
  }

  // none succeeded
const finalMessage: string = (
  (lastErr ? getErrMsg(lastErr) : null) ||
  "Upload failed: no reachable upload endpoint"
);

throw new Error(finalMessage);
}