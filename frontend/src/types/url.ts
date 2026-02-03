export interface UrlResponse {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clickCount: number;
  createdAt: string;
}

export interface ShortenUrlRequest {
  url: string;
}

export interface ApiError {
  message: string | string[];
  statusCode: number;
  error?: string;
}
