import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  current: 1 | 2 | 3 | 4;
  total?: number;
  labels?: string[];
}

export function StepBar({ current, total = 4, labels }: Props): React.ReactElement {
  const { color, font, spacing } = useTheme();
  return (
    <View style={{ gap: spacing.sm, paddingHorizontal: spacing.lg }}>
      <View style={{ flexDirection: 'row', gap: spacing.xs }}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i + 1 <= current ? color.gold : color.border }} />
        ))}
      </View>
      <Text style={{ color: color.muted, fontSize: font.size.xs, letterSpacing: 1, textTransform: 'uppercase' }}>
        Étape {current} / {total}{labels?.[current - 1] ? ` · ${labels[current - 1]}` : ''}
      </Text>
    </View>
  );
}
