import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'moveo-secure' });

const KEYS = {
  access: 'auth.accessToken',
  refresh: 'auth.refreshToken',
} as const;

export const tokenStore = {
  setTokens(access: string, refresh: string): void {
    storage.set(KEYS.access, access);
    storage.set(KEYS.refresh, refresh);
  },
  setAccess(access: string): void {
    storage.set(KEYS.access, access);
  },
  getAccess(): string | undefined {
    return storage.getString(KEYS.access);
  },
  getRefresh(): string | undefined {
    return storage.getString(KEYS.refresh);
  },
  clear(): void {
    storage.delete(KEYS.access);
    storage.delete(KEYS.refresh);
  },
};
