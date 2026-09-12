import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, fonts } from '../theme';

const DOW = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function toKey(d) {
  return d.toISOString().slice(0, 10);
}

function computeStreak(workoutDates) {
  if (workoutDates.size === 0) return 0;
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  // allow today to be "not yet trained" without breaking the streak
  if (!workoutDates.has(toKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (workoutDates.has(toKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default function StreakCalendar({ workoutLog }) {
  const workoutDates = new Set(workoutLog.map((w) => w.date));
  const streak = computeStreak(workoutDates);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>RACHA ACTUAL</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={styles.streakValue}>{streak}</Text>
          <Text style={styles.streakUnit}>DIAS</Text>
        </View>
      </View>

      <View style={styles.dowRow}>
        {DOW.map((d, i) => (
          <Text key={i} style={styles.dowText}>{d}</Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((d, i) => {
          if (d === null) return <View key={i} style={styles.cell} />;
          const key = toKey(new Date(year, month, d));
          const trained = workoutDates.has(key);
          const isToday = d === today.getDate();
          return (
            <View key={i} style={styles.cell}>
              <View style={[styles.dayDot, trained && styles.dayDotActive, isToday && styles.dayDotToday]}>
                <Text style={[styles.dayText, trained && styles.dayTextActive]}>{d}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  label: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.4, color: colors.textFaint },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  streakFire: { fontSize: 14 },
  streakValue: { fontFamily: fonts.display, fontSize: 18, color: colors.text },
  streakUnit: { fontFamily: fonts.mono, fontSize: 9, color: colors.textFaint },
  dowRow: { flexDirection: 'row', marginBottom: 4 },
  dowText: { flex: 1, textAlign: 'center', fontFamily: fonts.mono, fontSize: 9, color: colors.textFaint },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, alignItems: 'center', marginVertical: 3 },
  dayDot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  dayDotActive: { backgroundColor: colors.lime },
  dayDotToday: { borderWidth: 1, borderColor: colors.lime },
  dayText: { fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint },
  dayTextActive: { color: colors.bg, fontFamily: fonts.monoBold },
});
