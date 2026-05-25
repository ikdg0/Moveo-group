import mongoose, { Document, Schema, Types } from 'mongoose';

export type BookingStatus  = 'pending' | 'confirmed' | 'cancelled';
export type BookingVehicle = 'premium' | 'business' | 'prestige' | 'minibus';

export interface IBooking extends Document {
  userId: Types.ObjectId;
  status: BookingStatus;
  vehicleType: BookingVehicle;
  originText: string;
  destinationText: string;
  scheduledAt: Date;
  passengers: number;
  estimatedPrice: number;
  notes?: string;
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId:          { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status:          { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' },
    vehicleType:     { type: String, enum: ['premium', 'business', 'prestige', 'minibus'], required: true },
    originText:      { type: String, required: true, maxlength: 255 },
    destinationText: { type: String, required: true, maxlength: 255 },
    scheduledAt:     { type: Date, required: true },
    passengers:      { type: Number, required: true, min: 1, max: 8, default: 1 },
    estimatedPrice:  { type: Number, required: true },
    notes:           { type: String, maxlength: 2000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

BookingSchema.index({ userId: 1, createdAt: -1 });

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
