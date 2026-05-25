import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { color, font, radius, spacing } from '../constants/theme';

interface Props extends Omit<TextInputProps, 'style'> {
  label?: string;
  leadingDot?: 'gold' | 'muted';
  containerStyle?: ViewStyle;
  error?: string;
}

export function TextField({
  label,
  leadingDot,
  containerStyle,
  error,
  ...input
}: Props): React.ReactElement {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
        {leadingDot ? (
          <View
            style={[
              styles.dot,
              { backgroundColor: leadingDot === 'gold' ? color.gold : color.muted },
            ]}
          />
        ) : null}
        <TextInput
          placeholderTextColor={color.muted}
          style={styles.input}
          {...input}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  label: {
    color: color.muted,
    fontSize: font.size.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inputRow: {
    backgroundColor: color.surface,
    borderColor: color.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  inputRowError: { borderColor: color.danger },
  dot: { width: 10, height: 10, borderRadius: 5 },
  input: {
    flex: 1,
    color: color.text,
    fontSize: font.size.md,
    paddingVertical: spacing.md,
  },
  errorText: { color: color.danger, fontSize: font.size.xs },
});
