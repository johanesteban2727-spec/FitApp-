import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, fonts } from '../theme';

export default function RestTimer({ seconds = 90 }) {
  const [remaining, setRemaining] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const start = () => {
    clearInterval(intervalRef.current);
    setRemaining(seconds);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          Vibration.vibrate([0, 300, 100, 300]);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setRemaining(null);
  };

  if (remaining === null) {
    return (
      <TouchableOpacity style={styles.startButton} onPress={start} activeOpacity={0.8}>
        <Ionicons name="timer-outline" size={14} color={colors.lime} />
        <Text style={styles.startText}>DESCANSO {seconds}S</Text>
      </TouchableOpacity>
    );
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <TouchableOpacity style={styles.runningButton} onPress={stop} activeOpacity={0.8}>
      <Ionicons name="stop-circle" size={14} color={colors.bg} />
      <Text style={styles.runningText}>{mm}:{ss}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  startButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', borderWidth: 1, borderColor: colors.lime,
    borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 6, marginTop: spacing.sm,
  },
  startText: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 0.8, color: colors.lime },
  runningButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', backgroundColor: colors.lime,
    borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 6, marginTop: spacing.sm,
  },
  runningText: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.bg },
});
