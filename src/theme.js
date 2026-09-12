export const colors = {
  bg: '#0a0b0f',
  bgAlt: '#111319',
  card: '#161923',
  cardAlt: '#1d2130',
  border: '#262b3a',
  text: '#ffffff',
  textDim: '#9aa0b4',
  textFaint: '#5c6178',
  primary: '#ff3b3f',
  primaryDim: '#ff3b3f33',
  accent: '#ffb020',
  success: '#33d17a',
  gradientPrimary: ['#ff3b3f', '#ff7a3f'],
  gradientDark: ['#161923', '#0a0b0f'],
  gradientHero: ['#00000000', '#0a0b0fee', '#0a0b0f'],
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 8, md: 14, lg: 20, xl: 28, full: 999 };

export const typography = {
  hero: { fontSize: 32, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  h1: { fontSize: 24, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
  h2: { fontSize: 18, fontWeight: '700', color: colors.text },
  body: { fontSize: 14, fontWeight: '500', color: colors.textDim },
  caption: { fontSize: 12, fontWeight: '600', color: colors.textFaint },
};
