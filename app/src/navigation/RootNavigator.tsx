import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../store/authStore';
import { AuthNavigator } from './AuthNavigator';
import { MainTabsNavigator } from './MainTabsNavigator';
import { BookingNavigator } from './BookingNavigator';
import { RootStackParamList } from './types';
import { color } from '../constants/theme';
import { Loader } from '../components/Loader';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: color.primary,
    card: color.primary,
    text: color.text,
    border: color.border,
    primary: color.gold,
    notification: color.gold,
  },
};

export function RootNavigator(): React.ReactElement {
  const status = useAuthStore((s) => s.status);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (status === 'unknown') return <Loader />;

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" backgroundColor={color.primary} />
      {status === 'authenticated' ? (
        <Stack.Navigator
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.primary } }}
        >
          <Stack.Screen name="Main" component={MainTabsNavigator} />
          <Stack.Screen
            name="Booking"
            component={BookingNavigator}
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
        </Stack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
