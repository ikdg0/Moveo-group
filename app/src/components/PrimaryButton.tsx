import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'gold' | 'outline' | 'ghost';
  style?: ViewStyle;
}

export function PrimaryButton({ label, onPress, loading = false, disabled = false, variant = 'gold', style }: Props): React.ReactElement {
  const { color, font, radius, spacing } = useTheme();
  const isInactive = disabled || loading;

  const base: ViewStyle = {
    height: 54,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  };
  const variantStyle: ViewStyle =
    variant === 'gold'    ? { backgroundColor: color.gold } :
    variant === 'outline' ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: color.gold } :
                            { backgroundColor: 'transparent' };

  const labelColor = variant === 'gold' ? color.onGold : color.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      style={({ pressed }) => [base, variantStyle, isInactive && styles.disabled, pressed && !isInactive && styles.pressed, style]}
    >
      {loading
        ? <ActivityIndicator color={variant === 'gold' ? color.onGold : color.gold} />
        : <Text style={{ fontSize: font.size.md, fontWeight: font.weight.semibold, letterSpacing: 0.3, color: labelColor }}>{label}</Text>
      }
    </Pressable>
  );
}

const styles = StyleSheet.create({
  disabled: { opacity: 0.5 },
  pressed:  { opacity: 0.85 },
});
