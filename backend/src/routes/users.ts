import { Router } from 'express';
import { z } from 'zod';
import { User } from '../models/User';
import { requireAuth, AuthedRequest } from '../middleware/auth';
import { HttpError } from '../middleware/errors';

const router = Router();

const UpdateSchema = z
  .object({
    firstName: z.string().trim().min(1).max(80).optional(),
    lastName:  z.string().trim().min(1).max(80).optional(),
    phone:     z.string().trim().min(6).max(40).optional(),
  })
  .refine((d) => d.firstName !== undefined || d.lastName !== undefined || d.phone !== undefined, {
    message: 'At least one field is required',
  });

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById((req as AuthedRequest).userId).lean();
    if (!user) throw new HttpError(404, 'User not found');
    res.json({ user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone } });
  } catch (e) { next(e); }
});

router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const body = UpdateSchema.parse(req.body);
    const update: Record<string, string> = {};
    if (body.firstName) update['firstName'] = body.firstName;
    if (body.lastName)  update['lastName']  = body.lastName;
    if (body.phone)     update['phone']     = body.phone;

    const user = await User.findByIdAndUpdate((req as AuthedRequest).userId, { $set: update }, { new: true }).lean();
    if (!user) throw new HttpError(404, 'User not found');
    res.json({ user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone } });
  } catch (e) { next(e); }
});

export default router;
