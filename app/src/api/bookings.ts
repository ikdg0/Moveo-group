import { api } from './client';
import { Booking, EstimateItem } from './types';
import { VehicleType } from '../constants/vehicles';

export const bookingsApi = {
  estimate: (input: { origin: string; destination: string; passengers: number }) =>
    api
      .post<{ estimates: EstimateItem[] }>('/bookings/estimate', input)
      .then((r) => r.data.estimates),

  create: (input: {
    origin: string;
    destination: string;
    scheduledAt: string;
    passengers: number;
    vehicleType: VehicleType;
    notes?: string;
  }) => api.post<{ booking: Booking }>('/bookings', input).then((r) => r.data.booking),

  list: () => api.get<{ bookings: Booking[] }>('/bookings').then((r) => r.data.bookings),

  cancel: (id: string) =>
    api.patch<{ booking: Booking }>(`/bookings/${id}/cancel`).then((r) => r.data.booking),
};
