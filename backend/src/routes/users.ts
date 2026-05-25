import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';
import { requireAuth, AuthedRequest } from '../middleware/auth';
import { HttpError } from '../middleware/errors';

const router = Router();

const UpdateSchema = z.object({
  firstName: z.string().trim().min(1).max(80).optional(),
  phone: z.string().trim().min(6).max(40).optional(),
}).refine((d) => d.firstName !== undefined || d.phone !== undefined, {
  message: 'At least one field is required',
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as AuthedRequest).userId;
    const result = await pool.query(
      'SELECT id, first_name, email, phone FROM users WHERE id = $1',
      [userId],
    );
    const user = result.rows[0];
    if (!user) throw new HttpError(404, 'User not found');
    res.json({
      user: { id: user.id, firstName: user.first_name, email: user.email, phone: user.phone },
    });
  } catch (e) {
    next(e);
  }
});

router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as AuthedRequest).userId;
    const body = UpdateSchema.parse(req.body);
    const result = await pool.query(
      `UPDATE users
         SET first_name = COALESCE($2, first_name),
             phone      = COALESCE($3, phone),
             updated_at = NOW()
       WHERE id = $1
       RETURNING id, first_name, email, phone`,
      [userId, body.firstName ?? null, body.phone ?? null],
    );
    const user = result.rows[0];
    if (!user) throw new HttpError(404, 'User not found');
    res.json({
      user: { id: user.id, firstName: user.first_name, email: user.email, phone: user.phone },
    });
  } catch (e) {
    next(e);
  }
});

export default router;
