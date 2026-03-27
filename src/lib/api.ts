const BASE = "";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  venues: {
    list: (params?: string) => apiFetch<{ venues: unknown[]; total: number }>(`/api/venues${params ? `?${params}` : ""}`),
    get: (id: string) => apiFetch<unknown>(`/api/venues/${id}`),
  },
  posts: {
    list: (params?: string) => apiFetch<{ posts: unknown[]; total: number }>(`/api/posts${params ? `?${params}` : ""}`),
    get: (id: string) => apiFetch<unknown>(`/api/posts/${id}`),
    create: (data: unknown) => apiFetch<unknown>("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
  },
  jobs: {
    list: (params?: string) => apiFetch<{ jobs: unknown[]; total: number }>(`/api/jobs${params ? `?${params}` : ""}`),
    create: (data: unknown) => apiFetch<unknown>("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
  },
  feed: {
    list: (params?: string) => apiFetch<{ items: unknown[]; total: number }>(`/api/feed${params ? `?${params}` : ""}`),
  },
  auth: {
    login: (data: { username: string; password: string }) => apiFetch<{ token: string; user: unknown }>("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
    register: (data: unknown) => apiFetch<unknown>("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
  },
};
