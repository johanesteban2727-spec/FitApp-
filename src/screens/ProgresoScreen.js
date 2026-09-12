import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BodyLog, WorkoutLog, Profile, DEFAULT_PROFILE } from '../storage/storage';
import ProgressRing from '../components/ProgressRing';
import LineChart from '../components/LineChart';
import StreakCalendar from '../components/StreakCalendar';
import { colors, radius, spacing, typography, fonts } from '../theme';

const DAYS = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
const MONTHS = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

export default function ProgresoScreen() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [arm, setArm] = useState('');
  const [chest, setChest] = useState('');
  const [log, setLog] = useState([]);
  const [workoutLog, setWorkoutLog] = useState([]);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    BodyLog.getAll().then((all) => setLog([...all].reverse()));
    Profile.get().then(setProfile);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      WorkoutLog.getAll().then(setWorkoutLog);
    }, [])
  );

  const save = async () => {
    if (!weight) return;
    const entry = {
      date: new Date().toISOString().slice(0, 10),
      weight: Number(weight),
      height: height ? Number(height) : log[0]?.height ?? null,
      waist: waist ? Number(waist) : null,
      arm: arm ? Number(arm) : null,
      chest: chest ? Number(chest) : null,
    };
    const all = await BodyLog.add(entry);
    setLog([...all].reverse());
    setWeight(''); setWaist(''); setArm(''); setChest('');
    setShowForm(false);
  };

  const last = log[0];
  const first = log[log.length - 1];
  const bmi = last?.weight && last?.height ? (last.weight / ((last.height / 100) ** 2)).toFixed(1) : null;
  const gained = last && first ? (last.weight - first.weight).toFixed(1) : null;
  const progress = profile.metaPeso && first
    ? Math.min(Math.max((last.weight - first.weight) / (profile.metaPeso - first.weight), 0), 1)
    : last && first
    ? Math.min(Math.max((last.weight - first.weight) / 2, 0), 1)
    : 0;
  const today = new Date();
  const weightSeries = [...log].reverse().map((e) => e.weight);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={log}
        keyExtractor={(item, i) => item.date + i}
        contentContainerStyle={{ paddingBottom: 140 }}
        ListHeaderComponent={
          <View>
            <Animated.View entering={FadeIn.duration(500)} style={styles.topRow}>
              <View style={styles.badge}>
                <Ionicons name="flash" size={16} color={colors.bg} />
              </View>
              <Text style={styles.brand}>PULSO</Text>
              <Text style={styles.brandSub}>FUERZA / NUTRICION</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.hero}>
              <View style={styles.liveSignalRow}>
                <View style={styles.liveDot} />
                <Text style={styles.liveSignal}>{DAYS[today.getDay()]}, {today.getDate()} {MONTHS[today.getMonth()]}</Text>
              </View>
              <Text style={styles.heroTitle}>Sigue{'\n'}creciendo.</Text>
              <Text style={styles.heroSub}>
                {last ? `Vas en ${last.weight} kg. Cada registro cuenta para tu volumen.` : 'Registra tu primer peso para arrancar tu fase de volumen.'}
              </Text>

              <View style={styles.ringRow}>
                <ProgressRing size={104} strokeWidth={8} progress={progress || 0.04} color={colors.lime}>
                  <Text style={styles.ringValue}>{last ? last.weight : '--'}</Text>
                  <Text style={styles.ringUnit}>KG</Text>
                </ProgressRing>
                <View style={{ flex: 1, marginLeft: spacing.lg }}>
                  <Text style={styles.label}>GANADO DESDE EL INICIO</Text>
                  <Text style={styles.bigStat}>{gained ?? '0.0'} <Text style={styles.bigStatUnit}>kg</Text></Text>
                  {bmi && <Text style={styles.smallStat}>IMC {bmi}</Text>}
                </View>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(160).springify()} style={styles.statsCard}>
              <Stat label="REGISTROS" value={String(log.length)} />
              <View style={styles.divider} />
              <Stat label="META" value={profile.metaPeso ? String(profile.metaPeso) : '--'} unit="KG" />
              <View style={styles.divider} />
              <Stat label="ALTURA" value={last?.height ? String(last.height) : '--'} unit="CM" />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(190).springify()} style={styles.chartCard}>
              <Text style={styles.label}>TENDENCIA DE PESO</Text>
              <View style={{ marginTop: spacing.md }}>
                <LineChart data={weightSeries} unit="kg" />
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(210).springify()} style={{ marginBottom: spacing.lg }}>
              <StreakCalendar workoutLog={workoutLog} />
            </Animated.View>

            {!showForm ? (
              <Animated.View entering={FadeInDown.delay(220).springify()}>
                <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)} activeOpacity={0.85}>
                  <Ionicons name="add" size={18} color={colors.bg} />
                  <Text style={styles.addButtonText}>NUEVO REGISTRO</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeInDown.springify()} style={styles.form}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                  <TextInput style={styles.input} placeholder="Peso (kg)" placeholderTextColor={colors.textFaint} keyboardType="decimal-pad" value={weight} onChangeText={setWeight} />
                  <TextInput style={styles.input} placeholder="Altura (cm) - opcional" placeholderTextColor={colors.textFaint} keyboardType="decimal-pad" value={height} onChangeText={setHeight} />
                  <View style={styles.row3}>
                    <TextInput style={[styles.input, styles.inputThird]} placeholder="Cintura" placeholderTextColor={colors.textFaint} keyboardType="decimal-pad" value={waist} onChangeText={setWaist} />
                    <TextInput style={[styles.input, styles.inputThird]} placeholder="Brazo" placeholderTextColor={colors.textFaint} keyboardType="decimal-pad" value={arm} onChangeText={setArm} />
                    <TextInput style={[styles.input, styles.inputThird]} placeholder="Pecho" placeholderTextColor={colors.textFaint} keyboardType="decimal-pad" value={chest} onChangeText={setChest} />
                  </View>
                  <TouchableOpacity style={styles.saveButton} onPress={save} activeOpacity={0.85}>
                    <Text style={styles.saveButtonText}>GUARDAR</Text>
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              </Animated.View>
            )}

            <Text style={styles.sectionTitle}>Historial</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 40).duration(400)} style={styles.row}>
            <View style={styles.rowBar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowDate}>{item.date}</Text>
              <Text style={styles.rowMain}>{item.weight} kg{item.height ? `  ·  ${item.height} cm` : ''}</Text>
              {(item.waist || item.arm || item.chest) && (
                <Text style={styles.rowSmall}>
                  {item.waist ? `Cintura ${item.waist}cm  ` : ''}
                  {item.arm ? `Brazo ${item.arm}cm  ` : ''}
                  {item.chest ? `Pecho ${item.chest}cm` : ''}
                </Text>
              )}
            </View>
          </Animated.View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aun no tienes registros. Agrega el primero.</Text>}
      />
    </SafeAreaView>
  );
}

function Stat({ label, value, unit }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.statValue}>{value}{unit ? <Text style={styles.statUnit}> {unit}</Text> : null}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.lg },
  badge: { width: 30, height: 30, borderRadius: radius.full, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' },
  brand: { fontFamily: fonts.display, fontSize: 18, color: colors.text, letterSpacing: -0.5 },
  brandSub: { ...typography.label, marginLeft: spacing.sm },
  hero: { backgroundColor: colors.cardAlt, borderRadius: radius.xl, padding: spacing.xl, marginBottom: spacing.md },
  liveSignalRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveSignal: { ...typography.labelLime },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.lime },
  heroTitle: { ...typography.hero, fontSize: 38, marginTop: spacing.md },
  heroSub: { color: colors.textDim, fontSize: 13, lineHeight: 19, marginTop: spacing.sm, maxWidth: '90%' },
  ringRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xl },
  ringValue: { fontFamily: fonts.display, fontSize: 22, color: colors.text },
  ringUnit: { ...typography.label, marginTop: 2 },
  label: { ...typography.label },
  bigStat: { fontFamily: fonts.display, fontSize: 30, color: colors.text, marginTop: spacing.xs },
  bigStatUnit: { fontSize: 14, color: colors.textFaint, fontFamily: undefined },
  smallStat: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  statsCard: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  chartCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  divider: { width: 1, backgroundColor: colors.border, marginHorizontal: spacing.md },
  statValue: { fontFamily: fonts.display, fontSize: 20, color: colors.text, marginTop: spacing.xs },
  statUnit: { fontSize: 10, color: colors.textFaint, fontFamily: fonts.mono },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.lime, borderRadius: radius.full, paddingVertical: 16, marginBottom: spacing.lg },
  addButtonText: { fontFamily: fonts.monoBold, fontSize: 11, letterSpacing: 1, color: colors.bg },
  form: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  input: { backgroundColor: colors.cardAlt, color: colors.text, padding: 12, borderRadius: radius.md, marginBottom: spacing.sm },
  row3: { flexDirection: 'row', gap: spacing.sm },
  inputThird: { flex: 1 },
  saveButton: { backgroundColor: colors.lime, padding: 14, borderRadius: radius.md, alignItems: 'center', marginTop: spacing.xs },
  saveButtonText: { fontFamily: fonts.monoBold, fontSize: 11, letterSpacing: 1, color: colors.bg },
  sectionTitle: { ...typography.h2, marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.card, padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  rowBar: { width: 4, height: 36, borderRadius: radius.full, backgroundColor: colors.lime },
  rowDate: { ...typography.label },
  rowMain: { color: colors.text, fontFamily: fonts.displayMedium, fontSize: 15, marginTop: 2 },
  rowSmall: { ...typography.label, marginTop: 2, textTransform: 'none' },
  empty: { color: colors.textFaint, fontStyle: 'italic', textAlign: 'center', marginTop: spacing.xl },
});
