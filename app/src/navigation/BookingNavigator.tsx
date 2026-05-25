import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookingStackParamList } from './types';
import { BookingOriginScreen } from '../screens/booking/BookingOriginScreen';
import { BookingDetailsScreen } from '../screens/booking/BookingDetailsScreen';
import { VehicleSelectionScreen } from '../screens/booking/VehicleSelectionScreen';
import { BookingConfirmScreen } from '../screens/booking/BookingConfirmScreen';
import { color, font } from '../constants/theme';

const Stack = createNativeStackNavigator<BookingStackParamList>();

export function BookingNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: color.primary },
        headerTintColor: color.text,
        headerShadowVisible: false,
        headerTitleStyle: { color: color.text, fontWeight: font.weight.semibold },
        contentStyle: { backgroundColor: color.primary },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="BookingOrigin"
        component={BookingOriginScreen}
        options={{ title: 'Réserver' }}
      />
      <Stack.Screen
        name="BookingDetails"
        component={BookingDetailsScreen}
        options={{ title: 'Détails' }}
      />
      <Stack.Screen
        name="VehicleSelection"
        component={VehicleSelectionScreen}
        options={{ title: 'Véhicule' }}
      />
      <Stack.Screen
        name="BookingConfirm"
        component={BookingConfirmScreen}
        options={{ title: 'Confirmation' }}
      />
    </Stack.Navigator>
  );
}
