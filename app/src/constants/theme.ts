/**
 * Identité visuelle Moveo — palette stricte.
 * TOUJOURS passer par useTheme() dans les composants, jamais importer color directement.
 */

export interface ColorPalette {
  primary: string;
  gold: string;
  goldDim: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  text: string;
  muted: string;
  success: string;
  danger: string;
  /** Texte sur bouton gold (contraste inversé selon le mode) */
  onGold: string;
  /** Fond de l'app (status bar, nav bas) */
  background: string;
}

export const darkColors: ColorPalette = {
  primary:         '#0A0A0A',
  gold:            '#C8A96A',
  goldDim:         '#9C8554',
  surface:         '#161616',
  surfaceElevated: '#1F1F1F',
  border:          '#2A2A2A',
  text:            '#FFFFFF',
  muted:           '#888888',
  success:         '#3FB984',
  danger:          '#E5484D',
  onGold:          '#0A0A0A',
  background:      '#0A0A0A',
};

export const lightColors: ColorPalette = {
  primary:         '#FAFAFA',
  gold:            '#C8A96A',
  goldDim:         '#9C8554',
  surface:         '#FFFFFF',
  surfaceElevated: '#F0F0F0',
  border:          '#E0E0E0',
  text:            '#0A0A0A',
  muted:           '#6B6B6B',
  success:         '#2D9B68',
  danger:          '#CC2B30',
  onGold:          '#FFFFFF',
  background:      '#FAFAFA',
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 28,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const font = {
  size: {
    xs: 12,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 22,
    xxl: 28,
  },
  weight: {
    regular: '400' as const,
    medium:  '500' as const,
    semibold:'600' as const,
    bold:    '700' as const,
  },
} as const;

export type ThemeMode = 'dark' | 'light';
