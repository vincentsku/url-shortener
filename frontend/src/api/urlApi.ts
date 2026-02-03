import { UrlResponse, ShortenUrlRequest, ApiError } from '../types/url';

const API_BASE = '/api';

export async function shortenUrl(request: ShortenUrlRequest): Promise<UrlResponse> {
  const response = await fetch(`${API_BASE}/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    const message = Array.isArray(error.message)
      ? error.message[0]
      : error.message;
    throw new Error(message);
  }

  return response.json();
}

export async function getUrlStats(shortCode: string): Promise<UrlResponse> {
  const response = await fetch(`${API_BASE}/stats/${shortCode}`);

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message as string);
  }

  return response.json();
}
