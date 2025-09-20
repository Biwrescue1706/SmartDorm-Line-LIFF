import { API_BASE } from "../config";

type Options = RequestInit & { json?: unknown };

export async function apiFetch<T>(path: string, opts: Options = {}): Promise<T> {
  const headers = new Headers(opts.headers || {});
  if (opts.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    credentials: "include", // สำคัญถ้า backend ใช้ session/cookie
    headers,
    body: opts.json !== undefined ? JSON.stringify(opts.json) : opts.body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}
