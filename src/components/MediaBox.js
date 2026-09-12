import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';

// Renders a real local image when `source` is provided (a require()'d asset),
// otherwise a gradient placeholder with an icon so layout never breaks
// while assets are still being generated.
export default function MediaBox({ source, icon = 'barbell', style, imageStyle, children }) {
  return (
    <View style={[styles.box, style]}>
      {source ? (
        <Image source={source} style={[StyleSheet.absoluteFill, imageStyle]} resizeMode="cover" />
      ) : (
        <LinearGradient colors={colors.gradientDark} style={StyleSheet.absoluteFill}>
          <View style={styles.iconWrap}>
            <Ionicons name={icon} size={28} color={colors.textFaint} />
          </View>
        </LinearGradient>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: 'hidden', borderRadius: radius.lg, backgroundColor: colors.cardAlt },
  iconWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
