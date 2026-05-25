import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export function Loader(): React.ReactElement {
  const { color, spacing } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, backgroundColor: color.background }}>
      <ActivityIndicator color={color.gold} size="large" />
    </View>
  );
}
