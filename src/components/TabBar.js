import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, radius } from '../theme';

const ICONS = {
  Progreso: 'trending-up',
  Rutinas: 'barbell',
  Nutricion: 'restaurant',
};

function TabButton({ route, isFocused, onPress }) {
  const scale = useSharedValue(isFocused ? 1 : 0.9);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0.9, { damping: 14, stiffness: 180 });
  }, [isFocused]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity onPress={onPress} style={styles.tab} activeOpacity={0.8}>
      <Animated.View style={[styles.tabInner, isFocused && styles.tabInnerActive, style]}>
        <Ionicons
          name={ICONS[route.name]}
          size={20}
          color={isFocused ? colors.text : colors.textFaint}
        />
        {isFocused && <Text style={styles.tabLabel}>{route.name}</Text>}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function TabBar({ state, navigation }) {
  return (
    <View style={styles.wrapper}>
      <BlurView intensity={40} tint="dark" style={styles.blur}>
        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            return (
              <TabButton
                key={route.key}
                route={route}
                isFocused={isFocused}
                onPress={() => navigation.navigate(route.name)}
              />
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    borderRadius: radius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  blur: { paddingVertical: 8, paddingHorizontal: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  tab: { flex: 1 },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  tabInnerActive: { backgroundColor: colors.primary },
  tabLabel: { color: colors.text, fontWeight: '700', fontSize: 13 },
});
