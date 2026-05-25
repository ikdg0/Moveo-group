import type { VehicleType } from '../constants/vehicles';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  status: BookingStatus;
  vehicleType: VehicleType;
  origin: string;
  destination: string;
  scheduledAt: string;
  passengers: number;
  estimatedPrice: number;
  notes: string | null;
  createdAt: string;
}

export interface EstimateItem {
  vehicleType: VehicleType;
  price: number;
  km: number;
}
