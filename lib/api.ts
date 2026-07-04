"use client";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const TOKEN_KEY = "mv.admin.token";
const REFRESH_KEY = "mv.admin.refresh";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}
export function setTokens(access: string, refresh: string) {
  window.localStorage.setItem(TOKEN_KEY, access);
  window.localStorage.setItem(REFRESH_KEY, refresh);
}
export function clearTokens() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type Options = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

/** ApiResponse<T> 봉투를 벗겨 data 를 반환. */
export async function api<T>(path: string, opts: Options = {}): Promise<T> {
  const { method = "GET", body, auth = true } = opts;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const t = getToken();
    if (t) headers["Authorization"] = `Bearer ${t}`;
  }
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("서버에 연결할 수 없습니다.", 0);
  }
  let payload: { statusCode: number; message: string; data: T } | null = null;
  try {
    payload = await res.json();
  } catch {}
  if (res.status === 401) throw new ApiError("인증이 필요합니다.", 401);
  if (!res.ok || (payload && payload.statusCode >= 400)) {
    throw new ApiError(payload?.message || `요청 실패 (${res.status})`, res.status);
  }
  return (payload ? payload.data : (undefined as T));
}
