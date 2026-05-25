import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';
import { requireAuth, AuthedRequest } from '../middleware/auth';
import { HttpError } from '../middleware/errors';
import { estimatePrice, listVehicleEstimates, VehicleType } from '../utils/pricing';
import { sendBookingConfirmation } from '../utils/email';

const router = Router();

const VEHICLES = ['premium', 'business', 'prestige', 'minibus'] as const;

const EstimateSchema = z.object({
  origin: z.string().trim().min(2).max(255),
  destination: z.string().trim().min(2).max(255),
  passengers: z.number().int().min(1).max(8).default(1),
  vehicleType: z.enum(VEHICLES).optional(),
});

const CreateSchema = z.object({
  origin: z.string().trim().min(2).max(255),
  destination: z.string().trim().min(2).max(255),
  scheduledAt: z.string().datetime(),
  passengers: z.number().int().min(1).max(8),
  vehicleType: z.enum(VEHICLES),
  notes: z.string().trim().max(2000).optional(),
});

router.post('/estimate', (req, res, next) => {
  try {
    const body = EstimateSchema.parse(req.body);
    if (body.vehicleType) {
      const { km, price } = estimatePrice({
        origin: body.origin,
        destination: body.destination,
        vehicleType: body.vehicleType as VehicleType,
        passengers: body.passengers,
      });
      res.json({ vehicleType: body.vehicleType, km, price });
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
    const result = await pool.query(
      `INSERT INTO bookings
         (user_id, status, vehicle_type, origin_text, destination_text,
          scheduled_at, passengers, estimated_price, notes)
       VALUES ($1, 'confirmed', $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, status, vehicle_type, origin_text, destination_text,
                 scheduled_at, passengers, estimated_price, notes, created_at`,
      [
        userId,
        body.vehicleType,
        body.origin,
        body.destination,
        body.scheduledAt,
        body.passengers,
        price,
        body.notes ?? null,
      ],
    );
    const booking = mapBooking(result.rows[0]);

    const userRow = await pool.query('SELECT first_name, email FROM users WHERE id = $1', [userId]);
    if (userRow.rows[0]) {
      sendBookingConfirmation({
        to: userRow.rows[0].email,
        firstName: userRow.rows[0].first_name,
        origin: body.origin,
        destination: body.destination,
        scheduledAt: new Date(body.scheduledAt),
        vehicleType: body.vehicleType,
        price,
      }).catch((e) => console.error('[email] failed', e));
    }

    res.status(201).json({ booking });
  } catch (e) {
    next(e);
  }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as AuthedRequest).userId;
    const result = await pool.query(
      `SELECT id, status, vehicle_type, origin_text, destination_text,
              scheduled_at, passengers, estimated_price, notes, created_at
       FROM bookings WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
    res.json({ bookings: result.rows.map(mapBooking) });
  } catch (e) {
    next(e);
  }
});

router.patch('/:id/cancel', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as AuthedRequest).userId;
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE bookings SET status = 'cancelled'
       WHERE id = $1 AND user_id = $2 AND status <> 'cancelled'
       RETURNING id, status, vehicle_type, origin_text, destination_text,
                 scheduled_at, passengers, estimated_price, notes, created_at`,
      [id, userId],
    );
    if (!result.rows[0]) throw new HttpError(404, 'Booking not found');
    res.json({ booking: mapBooking(result.rows[0]) });
  } catch (e) {
    next(e);
  }
});

function mapBooking(row: {
  id: string;
  status: string;
  vehicle_type: string;
  origin_text: string;
  destination_text: string;
  scheduled_at: Date;
  passengers: number;
  estimated_price: string;
  notes: string | null;
  created_at: Date;
}) {
  return {
    id: row.id,
    status: row.status,
    vehicleType: row.vehicle_type,
    origin: row.origin_text,
    destination: row.destination_text,
    scheduledAt: row.scheduled_at,
    passengers: row.passengers,
    estimatedPrice: Number(row.estimated_price),
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export default router;
