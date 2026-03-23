export const COLORS = {
  pageBackground: '#f3f4f6',
  surface: '#fff',
  textPrimary: '#1e2636',
  textSecondary: '#66758a',
  textMuted: '#9ba7b7',
  borderSubtle: '#d2d8e1',
  surfaceSubtle: '#f8f9fb',
  brand: '#08cdd2',
  brandDark: '#0f2437',
  danger: '#ff4d52',
  shadow: '#000',
} as const;

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  xxl: 32,
} as const;

export const RADIUS = {
  sm: 9,
  md: 12,
  lg: 14,
  circle: 48,
} as const;

export const CARD_BASE = {
  backgroundColor: COLORS.surface,
  borderRadius: RADIUS.lg,
  padding: SPACING.lg,
  shadowColor: COLORS.shadow,
  shadowOpacity: 0.03,
  shadowOffset: { width: 0, height: 6 },
  shadowRadius: 16,
  elevation: 1,
} as const;

export const HEADER_BASE = {
  height: 64,
  backgroundColor: COLORS.pageBackground,
  paddingHorizontal: SPACING.md,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
} as const;
