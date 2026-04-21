export interface IHttpClient {
  get<T>(path: string, options?: RequestInit, overrideBaseURL?: boolean): Promise<T>;
  post<T>(path: string, body?: unknown, options?: RequestInit, overrideBaseURL?: boolean): Promise<T>;
  put<T>(path: string, body?: unknown, options?: RequestInit, overrideBaseURL?: boolean): Promise<T>;
  delete<T>(path: string, options?: RequestInit, overrideBaseURL?: boolean): Promise<T>;
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
  defaultHeaders?: Record<string, string>;
}

export class FetchHttpClient implements IHttpClient {
  private readonly baseURL: string;
  private readonly timeout: number;
  private readonly defaultHeaders: Record<string, string>;

  constructor(options: FetchHttpClientOptions = {}) {
    this.baseURL = options.baseURL || import.meta.env.VITE_API_BASE_URL || "https://yts.mx/api/v2";
    this.timeout = options.timeout ?? 10000;
    this.defaultHeaders = {
      ...options.defaultHeaders,
    };
  }

  protected resolveUrl(path: string, overrideBaseURL: boolean): string {
    if (overrideBaseURL) return path;
    return `${this.baseURL}${path}`;
  }

  protected async request<T>(method: string, path: string, body?: unknown, options: RequestInit = {}, overrideBaseURL: boolean = false): Promise<T> {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.resolveUrl(path, overrideBaseURL), {
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

  get<T>(path: string, options?: RequestInit, overrideBaseURL?: boolean): Promise<T> {
    return this.request<T>("GET", path, undefined, options, overrideBaseURL);
  }

  post<T>(path: string, body?: unknown, options?: RequestInit, overrideBaseURL?: boolean): Promise<T> {
    return this.request<T>("POST", path, body, options, overrideBaseURL);
  }

  put<T>(path: string, body?: unknown, options?: RequestInit, overrideBaseURL?: boolean): Promise<T> {
    return this.request<T>("PUT", path, body, options, overrideBaseURL);
  }

  delete<T>(path: string, options?: RequestInit, overrideBaseURL?: boolean): Promise<T> {
    return this.request<T>("DELETE", path, undefined, options, overrideBaseURL);
  }
}

export const ApiClient: IHttpClient = new FetchHttpClient();
