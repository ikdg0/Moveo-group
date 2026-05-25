import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool } from '../db/pool';
import { signAccess, signRefresh, verifyRefresh } from '../utils/jwt';
import { HttpError } from '../middleware/errors';

const router = Router();

const RegisterSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().min(6).max(40),
  password: z.string().min(8).max(120),
});

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

const RefreshSchema = z.object({
  refreshToken: z.string().min(10),
});

router.post('/register', async (req, res, next) => {
  try {
    const body = RegisterSchema.parse(req.body);
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [body.email]);
    if (existing.rowCount && existing.rowCount > 0) {
      throw new HttpError(409, 'Email already registered');
    }
    const hash = await bcrypt.hash(body.password, 10);
    const inserted = await pool.query(
      `INSERT INTO users (first_name, email, phone, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, first_name, email, phone`,
      [body.firstName, body.email, body.phone, hash],
    );
    const user = inserted.rows[0];
    res.status(201).json({
      user: { id: user.id, firstName: user.first_name, email: user.email, phone: user.phone },
      accessToken: signAccess(user.id),
      refreshToken: signRefresh(user.id),
    });
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const body = LoginSchema.parse(req.body);
    const result = await pool.query(
      'SELECT id, first_name, email, phone, password_hash FROM users WHERE email = $1',
      [body.email],
    );
    const user = result.rows[0];
    if (!user) throw new HttpError(401, 'Invalid email or password');
    const ok = await bcrypt.compare(body.password, user.password_hash);
    if (!ok) throw new HttpError(401, 'Invalid email or password');
    res.json({
      user: { id: user.id, firstName: user.first_name, email: user.email, phone: user.phone },
      accessToken: signAccess(user.id),
      refreshToken: signRefresh(user.id),
    });
  } catch (e) {
    next(e);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const body = RefreshSchema.parse(req.body);
    const payload = verifyRefresh(body.refreshToken);
    res.json({ accessToken: signAccess(payload.sub) });
  } catch {
    next(new HttpError(401, 'Invalid refresh token'));
  }
});

export default router;
