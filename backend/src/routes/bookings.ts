import { Router } from 'express';
import { z } from 'zod';
import { Booking } from '../models/Booking';
import { User } from '../models/User';
import { requireAuth, AuthedRequest } from '../middleware/auth';
import { HttpError } from '../middleware/errors';
import { estimatePrice, listVehicleEstimates, VehicleType } from '../utils/pricing';
import { sendBookingConfirmation } from '../utils/email';

const router = Router();

const VEHICLES = ['premium', 'business', 'prestige', 'minibus'] as const;

const EstimateSchema = z.object({
  origin:      z.string().trim().min(2).max(255),
  destination: z.string().trim().min(2).max(255),
  passengers:  z.number().int().min(1).max(8).default(1),
  vehicleType: z.enum(VEHICLES).optional(),
});

const CreateSchema = z.object({
  origin:      z.string().trim().min(2).max(255),
  destination: z.string().trim().min(2).max(255),
  scheduledAt: z.string().datetime(),
  passengers:  z.number().int().min(1).max(8),
  vehicleType: z.enum(VEHICLES),
  notes:       z.string().trim().max(2000).optional(),
});

router.post('/estimate', (req, res, next) => {
  try {
    const body = EstimateSchema.parse(req.body);
    if (body.vehicleType) {
      const result = estimatePrice({
        origin: body.origin,
        destination: body.destination,
        vehicleType: body.vehicleType as VehicleType,
        passengers: body.passengers,
      });
      res.json({ vehicleType: body.vehicleType, ...result });
      return;
    }
    res.json({
      estimates: listVehicleEstimates({
        origin: body.origin,
        destination: body.destination,
        passengers: body.passengers,
      }),
    });
  } catch (e) {
    next(e);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as AuthedRequest).userId;
    const body = CreateSchema.parse(req.body);
    const { price } = estimatePrice({
      origin: body.origin,
      destination: body.destination,
      vehicleType: body.vehicleType as VehicleType,
      passengers: body.passengers,
    });

    const booking = await Booking.create({
      userId,
      status: 'confirmed',
      vehicleType: body.vehicleType,
      originText: body.origin,
      destinationText: body.destination,
      scheduledAt: new Date(body.scheduledAt),
      passengers: body.passengers,
      estimatedPrice: price,
      notes: body.notes,
    });

    const user = await User.findById(userId).lean();
    if (user) {
      sendBookingConfirmation({
        to: user.email,
        firstName: user.firstName,
        origin: body.origin,
        destination: body.destination,
        scheduledAt: new Date(body.scheduledAt),
        vehicleType: body.vehicleType,
        price,
      }).catch((e) => console.error('[email] failed', e));
    }

    res.status(201).json({ booking: mapBooking(booking) });
  } catch (e) {
    next(e);
  }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as AuthedRequest).userId;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 }).lean();
    res.json({ bookings: bookings.map(mapBooking) });
  } catch (e) {
    next(e);
  }
});

router.patch('/:id/cancel', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as AuthedRequest).userId;
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params['id'], userId, status: { $ne: 'cancelled' } },
      { status: 'cancelled' },
      { new: true },
    );
    if (!booking) throw new HttpError(404, 'Booking not found');
    res.json({ booking: mapBooking(booking) });
  } catch (e) {
    next(e);
  }
});

function mapBooking(b: {
  _id: unknown;
  status?: string;
  vehicleType?: string;
  originText?: string;
  destinationText?: string;
  scheduledAt?: Date;
  passengers?: number;
  estimatedPrice?: number;
  notes?: string;
  createdAt?: Date;
}) {
  return {
    id: String(b._id),
    status: b.status,
    vehicleType: b.vehicleType,
    origin: b.originText,
    destination: b.destinationText,
    scheduledAt: b.scheduledAt,
    passengers: b.passengers,
    estimatedPrice: b.estimatedPrice,
    notes: b.notes ?? null,
    createdAt: b.createdAt,
  };
}

export default router;
