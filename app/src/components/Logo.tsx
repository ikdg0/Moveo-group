import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ size = 'md' }: Props): React.ReactElement {
  const { color, font } = useTheme();
  const dim = size === 'lg' ? 44 : size === 'md' ? 32 : 24;
  return (
    <View style={styles.row}>
      <View style={[styles.mark, { width: dim, height: dim, borderRadius: dim / 2, backgroundColor: color.gold }]}>
        <Text style={[styles.markText, { fontSize: dim * 0.5, color: color.onGold, fontWeight: font.weight.bold }]}>M</Text>
      </View>
      <Text style={[styles.wordmark, { fontSize: size === 'lg' ? 26 : size === 'md' ? 20 : 16, color: color.text, fontWeight: font.weight.bold }]}>
        MOVEO
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark:     { alignItems: 'center', justifyContent: 'center' },
  markText: {},
  wordmark: { letterSpacing: 4 },
});
