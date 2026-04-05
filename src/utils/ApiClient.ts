export interface IHttpClient {
  get<T>(path: string, options?: RequestInit): Promise<T>;
  post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T>;
  put<T>(path: string, body?: unknown, options?: RequestInit): Promise<T>;
  delete<T>(path: string, options?: RequestInit): Promise<T>;
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public payload: unknown = null) {
    super(message);
    this.name = "ApiError";
  }
}

export interface FetchHttpClientOptions {
  baseURL?: string;
  timeout?: number;
  defaultHeaders?: HeadersInit;
}

export class FetchHttpClient implements IHttpClient {
  private readonly baseURL: string;
  private readonly timeout: number;
  private readonly defaultHeaders: HeadersInit;

  constructor(options: FetchHttpClientOptions = {}) {
    this.baseURL = options.baseURL || import.meta.env.VITE_API_BASE_URL || "https://yts.mx/api/v2";
    this.timeout = options.timeout ?? 10000;
    this.defaultHeaders = {
      ...options.defaultHeaders,
    };
  }

  protected resolveUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }
    return `${this.baseURL}${path}`;
  }

  protected async request<T>(method: string, path: string, body?: unknown, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.resolveUrl(path), {
        method,
        headers: {
          ...this.defaultHeaders,
          ...(options.headers || {}),
        },
        signal: controller.signal,
        body: body != null ? JSON.stringify(body) : undefined,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const rawText = await response.text().catch(() => "");
        const errorPayload = rawText ? rawText : null;
        throw new ApiError(response.status, `HTTP ${response.status} ${response.statusText}`, errorPayload);
      }

      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        return (await response.json()) as T;
      }

      return (await response.text()) as unknown as T;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>("GET", path, undefined, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>("POST", path, body, options);
  }

  put<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>("PUT", path, body, options);
  }

  delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>("DELETE", path, undefined, options);
  }
}

export const ApiClient: IHttpClient = new FetchHttpClient();
