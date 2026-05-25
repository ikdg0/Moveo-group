import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { color, font, spacing } from '../constants/theme';

interface Props {
  current: 1 | 2 | 3 | 4;
  total?: number;
  labels?: string[];
}

export function StepBar({ current, total = 4, labels }: Props): React.ReactElement {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {Array.from({ length: total }, (_, i) => {
          const step = i + 1;
          const active = step <= current;
          return (
            <View key={step} style={styles.segment}>
              <View
                style={[
                  styles.bar,
                  { backgroundColor: active ? color.gold : color.border },
                ]}
              />
            </View>
          );
        })}
      </View>
      <Text style={styles.label}>
        Étape {current} / {total}
        {labels?.[current - 1] ? ` · ${labels[current - 1]}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, paddingHorizontal: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.xs },
  segment: { flex: 1 },
  bar: { height: 3, borderRadius: 2 },
  label: {
    color: color.muted,
    fontSize: font.size.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
