const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api';
const TOKEN_KEY = 'erp_token';

type ApiRequestOptions = RequestInit & {
  skipAuth?: boolean;
};

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { skipAuth = false, headers, ...rest } = options;
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(rest.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(skipAuth || !token ? {} : { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? ((await response.json()) as ApiErrorBody & T)
    : ({} as ApiErrorBody & T);

  if (!response.ok) {
    const validationMessage = payload.errors
      ? Object.values(payload.errors).flat().join(' ')
      : undefined;
    throw new Error(payload.message || validationMessage || 'Request failed.');
  }

  return payload as T;
}
