import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { color, font, radius, spacing } from '../constants/theme';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'gold' | 'outline' | 'ghost';
  style?: ViewStyle;
}

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'gold',
  style,
}: Props): React.ReactElement {
  const isInactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        isInactive && styles.disabled,
        pressed && !isInactive && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'gold' ? color.primary : color.gold} />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'gold' ? styles.labelDark : styles.labelLight,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
  label: { fontSize: font.size.md, fontWeight: font.weight.semibold, letterSpacing: 0.3 },
  labelDark: { color: color.primary },
  labelLight: { color: color.text },
});

const variantStyles: Record<NonNullable<Props['variant']>, ViewStyle> = {
  gold: { backgroundColor: color.gold },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: color.gold },
  ghost: { backgroundColor: 'transparent' },
};
