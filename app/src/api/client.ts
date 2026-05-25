import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { tokenStore } from '../storage/secureStore';

const fromExtra = (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl;
const fromEnv = process.env.EXPO_PUBLIC_API_URL;
const API_URL = fromEnv ?? fromExtra ?? 'http://localhost:4000/api/v1';

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return null;
  try {
    const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
    const next = res.data?.accessToken as string | undefined;
    if (!next) return null;
    tokenStore.setAccess(next);
    return next;
  } catch {
    tokenStore.clear();
    return null;
  }
}

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      refreshPromise ||= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const next = await refreshPromise;
      if (next) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${next}`;
        return api.request(original);
      }
    }
    return Promise.reject(error);
  },
);

export function apiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string } | undefined;
    return data?.error ?? err.message ?? 'Erreur réseau';
  }
  return 'Erreur inattendue';
}
