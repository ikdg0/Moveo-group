import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { AuthStackParamList } from './types';
import { color } from '../constants/theme';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: color.primary },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
