import { darkColors, lightColors, font, radius, spacing, ColorPalette } from '../constants/theme';
import { useThemeStore } from '../store/themeStore';

export interface Theme {
  color: ColorPalette;
  font: typeof font;
  radius: typeof radius;
  spacing: typeof spacing;
  isDark: boolean;
}

export function useTheme(): Theme {
  const mode = useThemeStore((s) => s.mode);
  return {
    color:  mode === 'dark' ? darkColors : lightColors,
    font,
    radius,
    spacing,
    isDark: mode === 'dark',
  };
}
