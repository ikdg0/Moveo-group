import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { color, spacing } from '../constants/theme';

export function Loader(): React.ReactElement {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={color.gold} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: color.primary,
  },
});
