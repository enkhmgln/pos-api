export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface HttpRequestOptions {
  method: HttpMethod;
  path: string;
  params?: Record<string, string>;
  data?: unknown;
}
