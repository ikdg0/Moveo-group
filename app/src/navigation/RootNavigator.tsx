import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { darkColors, lightColors } from '../constants/theme';
import { AuthNavigator } from './AuthNavigator';
import { MainTabsNavigator } from './MainTabsNavigator';
import { BookingNavigator } from './BookingNavigator';
import { RootStackParamList } from './types';
import { Loader } from '../components/Loader';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.ReactElement {
  const status  = useAuthStore((s) => s.status);
  const hydrate = useAuthStore((s) => s.hydrate);
  const mode    = useThemeStore((s) => s.mode);

  useEffect(() => { hydrate(); }, [hydrate]);

  const c = mode === 'dark' ? darkColors : lightColors;

  const navTheme = mode === 'dark'
    ? { ...DarkTheme,    colors: { ...DarkTheme.colors,    background: c.background, card: c.primary, text: c.text, border: c.border, primary: c.gold, notification: c.gold } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: c.background, card: c.primary, text: c.text, border: c.border, primary: c.gold, notification: c.gold } };

  if (status === 'unknown') return <Loader />;

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} backgroundColor={c.background} />
      {status === 'authenticated' ? (
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.background } }}>
          <Stack.Screen name="Main"    component={MainTabsNavigator} />
          <Stack.Screen name="Booking" component={BookingNavigator} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        </Stack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
