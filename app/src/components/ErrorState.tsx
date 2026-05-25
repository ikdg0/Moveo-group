import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { color, font, spacing } from '../constants/theme';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: Props): React.ReactElement {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Une erreur est survenue</Text>
      <Text style={styles.body}>{message}</Text>
      {onRetry ? <PrimaryButton label="Réessayer" onPress={onRetry} variant="outline" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md, alignItems: 'center', paddingVertical: spacing.xxl },
  title: { color: color.text, fontSize: font.size.lg, fontWeight: font.weight.semibold },
  body: { color: color.muted, fontSize: font.size.md, textAlign: 'center' },
});
