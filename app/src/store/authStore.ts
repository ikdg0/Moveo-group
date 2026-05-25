import { create } from 'zustand';
import { authApi } from '../api/auth';
import { usersApi } from '../api/users';
import { tokenStore } from '../storage/secureStore';
import { User } from '../api/types';

interface AuthState {
  user: User | null;
  status: 'unknown' | 'unauthenticated' | 'authenticated';
  hydrate:  () => Promise<void>;
  login:    (email: string, password: string) => Promise<void>;
  register: (input: { firstName: string; lastName: string; email: string; phone: string; password: string }) => Promise<void>;
  logout:   () => void;
  setUser:  (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:   null,
  status: 'unknown',

  hydrate: async () => {
    const token = tokenStore.getAccess();
    if (!token) { set({ status: 'unauthenticated' }); return; }
    try {
      const user = await usersApi.me();
      set({ user, status: 'authenticated' });
    } catch {
      tokenStore.clear();
      set({ status: 'unauthenticated' });
    }
  },

  login: async (email, password) => {
    const data = await authApi.login({ email, password });
    tokenStore.setTokens(data.accessToken, data.refreshToken);
    set({ user: data.user, status: 'authenticated' });
  },

  register: async (input) => {
    const data = await authApi.register(input);
    tokenStore.setTokens(data.accessToken, data.refreshToken);
    set({ user: data.user, status: 'authenticated' });
  },

  logout: () => {
    tokenStore.clear();
    set({ user: null, status: 'unauthenticated' });
  },

  setUser: (user) => set({ user }),
}));
