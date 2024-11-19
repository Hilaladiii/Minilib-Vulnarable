export interface IResponseSuccess {
  statusCode: number;
  message: string;
  data: any;
}

export interface IResponseError extends Error {
  statusCode: number;
  message: string;
  error: string;
}
