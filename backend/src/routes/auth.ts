import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/User';
import { signAccess, signRefresh, verifyRefresh } from '../utils/jwt';
import { HttpError } from '../middleware/errors';

const router = Router();

const RegisterSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName:  z.string().trim().min(1).max(80),
  email:     z.string().trim().toLowerCase().email(),
  phone:     z.string().trim().min(6).max(40),
  password:  z.string().min(8).max(120),
});

const LoginSchema = z.object({
  email:    z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

const RefreshSchema = z.object({
  refreshToken: z.string().min(10),
});

router.post('/register', async (req, res, next) => {
  try {
    const body = RegisterSchema.parse(req.body);
    if (await User.findOne({ email: body.email }).lean()) throw new HttpError(409, 'Email already registered');

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await User.create({ firstName: body.firstName, lastName: body.lastName, email: body.email, phone: body.phone, passwordHash });

    res.status(201).json({
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone },
      accessToken:  signAccess(String(user._id)),
      refreshToken: signRefresh(String(user._id)),
    });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const body = LoginSchema.parse(req.body);
    const user = await User.findOne({ email: body.email });
    if (!user) throw new HttpError(401, 'Invalid email or password');
    if (!await bcrypt.compare(body.password, user.passwordHash)) throw new HttpError(401, 'Invalid email or password');

    res.json({
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone },
      accessToken:  signAccess(String(user._id)),
      refreshToken: signRefresh(String(user._id)),
    });
  } catch (e) { next(e); }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const body = RefreshSchema.parse(req.body);
    res.json({ accessToken: signAccess(verifyRefresh(body.refreshToken).sub) });
  } catch { next(new HttpError(401, 'Invalid refresh token')); }
});

export default router;
