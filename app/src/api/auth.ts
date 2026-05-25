import { api } from './client';
import { AuthResponse } from './types';

export const authApi = {
  register: (input: { firstName: string; email: string; phone: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', input).then((r) => r.data),

  login: (input: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', input).then((r) => r.data),
};
