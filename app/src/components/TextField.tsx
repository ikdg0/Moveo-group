import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props extends Omit<TextInputProps, 'style'> {
  label?: string;
  leadingDot?: 'gold' | 'muted';
  containerStyle?: ViewStyle;
  error?: string;
}

export function TextField({ label, leadingDot, containerStyle, error, ...input }: Props): React.ReactElement {
  const { color, font, radius, spacing } = useTheme();
  return (
    <View style={[{ gap: spacing.xs }, containerStyle]}>
      {label ? <Text style={{ color: color.muted, fontSize: font.size.xs, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</Text> : null}
      <View style={{
        backgroundColor: color.surface,
        borderColor: error ? color.danger : color.border,
        borderWidth: 1,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        minHeight: 52,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
      }}>
        {leadingDot ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: leadingDot === 'gold' ? color.gold : color.muted }} /> : null}
        <TextInput
          placeholderTextColor={color.muted}
          style={{ flex: 1, color: color.text, fontSize: font.size.md, paddingVertical: spacing.md }}
          {...input}
        />
      </View>
      {error ? <Text style={{ color: color.danger, fontSize: font.size.xs }}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({});
