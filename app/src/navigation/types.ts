import { NavigatorScreenParams } from '@react-navigation/native';
import { VehicleType } from '../constants/vehicles';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type BookingStackParamList = {
  BookingOrigin: { origin?: string; destination?: string } | undefined;
  BookingDetails: { origin: string; destination: string };
  VehicleSelection: {
    origin: string;
    destination: string;
    scheduledAt: string;
    passengers: number;
  };
  BookingConfirm: {
    origin: string;
    destination: string;
    scheduledAt: string;
    passengers: number;
    vehicleType: VehicleType;
    estimatedPrice: number;
  };
};

export type MainTabsParamList = {
  Home: undefined;
  History: undefined;
  Support: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabsParamList>;
  Booking: NavigatorScreenParams<BookingStackParamList>;
};
