import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { MainTabsParamList } from './types';

const GLYPHS: Record<keyof MainTabsParamList, string> = {
  Home:    '⌂',
  History: '◷',
  Support: '✱',
  Profile: '◉',
};

interface Props { name: keyof MainTabsParamList; focused: boolean; }

export function TabIcon({ name, focused }: Props): React.ReactElement {
  const { color, font } = useTheme();
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: 28 }}>
      <Text style={{ fontSize: 22, fontWeight: font.weight.semibold, color: focused ? color.gold : color.muted }}>{GLYPHS[name]}</Text>
    </View>
  );
}
