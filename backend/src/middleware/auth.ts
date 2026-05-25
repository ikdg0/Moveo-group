import { Request, Response, NextFunction } from 'express';
import { verifyAccess } from '../utils/jwt';

export interface AuthedRequest extends Request {
  userId: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing bearer token' });
    return;
  }
  try {
    const decoded = verifyAccess(header.slice('Bearer '.length).trim());
    (req as AuthedRequest).userId = decoded.sub;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
