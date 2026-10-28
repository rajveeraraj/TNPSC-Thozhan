import type { ApiResponse } from '@/types/api';

export class ApiClientError extends Error {
  public status: number;
  public data?: unknown;

  constructor(message: string, status = 500, data?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;
  private isMockMode: boolean;
  private token: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env?.VITE_API_BASE_URL || '/api';
    const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
    const mockEnv = import.meta.env?.VITE_USE_MOCK_API;
    this.isMockMode = isTest ? true : (mockEnv === 'false' ? false : true);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        this.token = window.localStorage.getItem('exambuddy_token');
      }
    } catch {
      this.token = null;
    }
  }

  public setMockMode(enabled: boolean): void {
    this.isMockMode = enabled;
  }

  public getMockMode(): boolean {
    return this.isMockMode;
  }

  public setToken(token: string | null): void {
    this.token = token;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (token) {
          window.localStorage.setItem('exambuddy_token', token);
        } else {
          window.localStorage.removeItem('exambuddy_token');
        }
      }
    } catch {
      // Ignored in environments where localStorage is not accessible
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          url.searchParams.append(key, String(val));
        }
      });
    }
    return url.toString();
  }

  public async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params);
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options?.headers,
    };

    try {
      const response = await fetch(url, { method: 'GET', headers });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiClientError(
          (errorData as { message?: string })?.message || `HTTP error ${response.status}`,
          response.status,
          errorData
        );
      }
      return (await response.json()) as ApiResponse<T>;
    } catch (err: unknown) {
      if (err instanceof ApiClientError) throw err;
      throw new ApiClientError((err as Error)?.message || 'Network request failed', 0);
    }
  }

  public async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params);
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options?.headers,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiClientError(
          (errorData as { message?: string })?.message || `HTTP error ${response.status}`,
          response.status,
          errorData
        );
      }
      return (await response.json()) as ApiResponse<T>;
    } catch (err: unknown) {
      if (err instanceof ApiClientError) throw err;
      throw new ApiClientError((err as Error)?.message || 'Network request failed', 0);
    }
  }
}

export const apiClient = new ApiClient();
