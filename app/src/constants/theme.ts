/**
 * Identité visuelle Moveo — palette stricte issue de moveo-group.be.
 * Toute couleur utilisée dans l'app DOIT être référencée ici, jamais en dur.
 */

export const color = {
  primary: '#0A0A0A',
  gold: '#C8A96A',
  goldDim: '#9C8554',
  surface: '#161616',
  surfaceElevated: '#1F1F1F',
  border: '#2A2A2A',
  text: '#FFFFFF',
  muted: '#888888',
  success: '#3FB984',
  danger: '#E5484D',
} as const;

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
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export const theme = { color, radius, spacing, font } as const;
export type Theme = typeof theme;
