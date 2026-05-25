import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { PrimaryButton } from './PrimaryButton';

interface Props { message: string; onRetry?: () => void; }

export function ErrorState({ message, onRetry }: Props): React.ReactElement {
  const { color, font, spacing } = useTheme();
  return (
    <View style={{ gap: spacing.md, alignItems: 'center', paddingVertical: spacing.xxl }}>
      <Text style={{ color: color.text, fontSize: font.size.lg, fontWeight: font.weight.semibold }}>Une erreur est survenue</Text>
      <Text style={{ color: color.muted, fontSize: font.size.md, textAlign: 'center' }}>{message}</Text>
      {onRetry ? <PrimaryButton label="Réessayer" onPress={onRetry} variant="outline" /> : null}
    </View>
  );
}
