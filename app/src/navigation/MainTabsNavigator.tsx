import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { HomeScreen } from '../screens/home/HomeScreen';
import { RideHistoryScreen } from '../screens/history/RideHistoryScreen';
import { SupportScreen } from '../screens/support/SupportScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { MainTabsParamList } from './types';
import { color, font } from '../constants/theme';
import { TabIcon } from './TabIcon';

const Tab = createBottomTabNavigator<MainTabsParamList>();

export function MainTabsNavigator(): React.ReactElement {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: color.primary,
          borderTopColor: color.border,
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
          height: Platform.OS === 'ios' ? 84 : 68,
        },
        tabBarActiveTintColor: color.gold,
        tabBarInactiveTintColor: color.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: font.weight.medium,
          letterSpacing: 0.5,
        },
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
      <Tab.Screen name="History" component={RideHistoryScreen} options={{ title: 'Courses' }} />
      <Tab.Screen name="Support" component={SupportScreen} options={{ title: 'Support' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}
