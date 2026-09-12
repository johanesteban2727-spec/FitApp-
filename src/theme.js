export const colors = {
  bg: '#11120f',
  card: '#191a17',
  cardAlt: '#262923',
  border: 'rgba(255,255,255,0.1)',
  borderStrong: 'rgba(255,255,255,0.25)',
  text: '#f3f2ea',
  textDim: 'rgba(243,242,234,0.6)',
  textFaint: 'rgba(243,242,234,0.4)',
  lime: '#dbff39',
  limeDim: 'rgba(219,255,57,0.1)',
  terracotta: '#d87d59',
  terracottaSoft: '#f7e7dc',
  success: '#87ad6c',
  gold: '#e2b96e',
  sky: '#6fdaec',
  pink: '#f2b9e3',
  // legacy aliases used by existing screens
  primary: '#dbff39',
  primaryDim: 'rgba(219,255,57,0.1)',
  accent: '#d87d59',
  gradientDark: ['#262923', '#191a17'],
  gradientPrimary: ['#dbff39', '#c8f01f'],
  gradientHero: ['#00000000', '#11120fee', '#11120f'],
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 10, md: 16, lg: 24, xl: 32, full: 999 };

export const fonts = {
  display: 'SpaceGrotesk_700Bold',
  displayMedium: 'SpaceGrotesk_500Medium',
  mono: 'SpaceMono_400Regular',
  monoBold: 'SpaceMono_700Bold',
};

export const typography = {
  hero: { fontFamily: fonts.display, fontSize: 34, color: colors.text, letterSpacing: -1.2, lineHeight: 36 },
  h1: { fontFamily: fonts.display, fontSize: 24, color: colors.text, letterSpacing: -0.8 },
  h2: { fontFamily: fonts.display, fontSize: 19, color: colors.text, letterSpacing: -0.5 },
  body: { fontSize: 14, fontWeight: '500', color: colors.textDim },
  label: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.6, color: colors.textFaint, textTransform: 'uppercase' },
  labelLime: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.6, color: colors.lime, textTransform: 'uppercase' },
};
