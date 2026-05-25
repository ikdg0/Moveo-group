import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../env';

export type AccessPayload = { sub: string; type: 'access' };
export type RefreshPayload = { sub: string; type: 'refresh' };

export function signAccess(userId: string): string {
  const opts: SignOptions = { expiresIn: env.jwt.accessTtl as SignOptions['expiresIn'] };
  return jwt.sign({ sub: userId, type: 'access' }, env.jwt.accessSecret, opts);
}

export function signRefresh(userId: string): string {
  const opts: SignOptions = { expiresIn: env.jwt.refreshTtl as SignOptions['expiresIn'] };
  return jwt.sign({ sub: userId, type: 'refresh' }, env.jwt.refreshSecret, opts);
}

export function verifyAccess(token: string): AccessPayload {
  const decoded = jwt.verify(token, env.jwt.accessSecret) as AccessPayload;
  if (decoded.type !== 'access') throw new Error('Invalid token type');
  return decoded;
}

export function verifyRefresh(token: string): RefreshPayload {
  const decoded = jwt.verify(token, env.jwt.refreshSecret) as RefreshPayload;
  if (decoded.type !== 'refresh') throw new Error('Invalid token type');
  return decoded;
}
