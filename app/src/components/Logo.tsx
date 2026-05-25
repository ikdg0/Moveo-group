import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { color, font } from '../constants/theme';

interface Props {
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ size = 'md' }: Props): React.ReactElement {
  const dim = size === 'lg' ? 44 : size === 'md' ? 32 : 24;
  return (
    <View style={styles.row}>
      <View
        style={[
          styles.mark,
          { width: dim, height: dim, borderRadius: dim / 2 },
        ]}
      >
        <Text style={[styles.markText, { fontSize: dim * 0.5 }]}>M</Text>
      </View>
      <Text
        style={[
          styles.wordmark,
          { fontSize: size === 'lg' ? 26 : size === 'md' ? 20 : 16 },
        ]}
      >
        MOVEO
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: {
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    color: color.primary,
    fontWeight: font.weight.bold,
  },
  wordmark: {
    color: color.text,
    letterSpacing: 4,
    fontWeight: font.weight.bold,
  },
});
