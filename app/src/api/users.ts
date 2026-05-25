import { api } from './client';
import { User } from './types';

export const usersApi = {
  me: () => api.get<{ user: User }>('/users/me').then((r) => r.data.user),
  update: (input: { firstName?: string; lastName?: string; phone?: string }) =>
    api.patch<{ user: User }>('/users/me', input).then((r) => r.data.user),
};
