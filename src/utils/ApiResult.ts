export interface ApiResult<T> {
  status: string;
  status_message: string;
  data?: T;
  "@meta"?: {
    server_time: number;
    server_timezone: string;
    api_version: number;
    execution_time: string;
  };
}
