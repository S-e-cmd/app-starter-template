import { APP_CONFIG } from '../config/app-config.js';

export async function requestJson(path, options = {}) {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? APP_CONFIG.requestTimeoutMs;
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const url = path.startsWith('http') ? path : `${APP_CONFIG.apiBaseUrl}${path}`;

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Invalid JSON response');
      }
    }
    if (!response.ok) {
      throw new Error(data?.error || `HTTP ${response.status}`);
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}
