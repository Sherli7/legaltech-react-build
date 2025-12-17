// Simple fetch wrapper to centralize API calls
type ApiOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export async function apiRequest<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const url = `${baseUrl}${path}`;

  const resp = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
    credentials: "include",
  });

  if (!resp.ok) {
    const message = await resp.text();
    throw new Error(message || `API error ${resp.status}`);
  }

  if (resp.status === 204) {
    return undefined as T;
  }

  return (await resp.json()) as T;
}
