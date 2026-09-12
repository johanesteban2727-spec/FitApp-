import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BodyLog } from '../storage/storage';
import ProgressRing from '../components/ProgressRing';
import { colors, radius, spacing, typography } from '../theme';

export default function ProgresoScreen() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [arm, setArm] = useState('');
  const [chest, setChest] = useState('');
  const [log, setLog] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    BodyLog.getAll().then((all) => setLog([...all].reverse()));
  }, []);

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
  const weeklyGoal = 0.3;
  const progress = last && first ? Math.min(Math.max((last.weight - first.weight) / weeklyGoal, 0), 1) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={log}
        keyExtractor={(item, i) => item.date + i}
        contentContainerStyle={{ paddingBottom: 140 }}
        ListHeaderComponent={
          <View>
            <Animated.View entering={FadeIn.duration(500)}>
              <Text style={styles.greeting}>Hola, Johan</Text>
              <Text style={styles.title}>Tu progreso</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.heroCard}>
              <LinearGradient colors={colors.gradientDark} style={styles.heroGradient}>
                <View style={styles.heroTop}>
                  <ProgressRing size={110} strokeWidth={9} progress={progress || 0.03}>
                    <Text style={styles.ringValue}>{last ? `${last.weight}` : '--'}</Text>
                    <Text style={styles.ringUnit}>kg</Text>
                  </ProgressRing>
                  <View style={styles.heroStats}>
                    <View style={styles.statRow}>
                      <Ionicons name="trending-up" size={16} color={colors.success} />
                      <Text style={styles.statLabel}>Ganado</Text>
                      <Text style={styles.statValue}>{gained ?? '0'} kg</Text>
                    </View>
                    {bmi && (
                      <View style={styles.statRow}>
                        <Ionicons name="body" size={16} color={colors.accent} />
                        <Text style={styles.statLabel}>IMC</Text>
                        <Text style={styles.statValue}>{bmi}</Text>
                      </View>
                    )}
                    <View style={styles.statRow}>
                      <Ionicons name="calendar" size={16} color={colors.textDim} />
                      <Text style={styles.statLabel}>Registros</Text>
                      <Text style={styles.statValue}>{log.length}</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>

            {!showForm ? (
              <Animated.View entering={FadeInDown.delay(200).springify()}>
                <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)} activeOpacity={0.85}>
                  <LinearGradient colors={colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.addButtonGradient}>
                    <Ionicons name="add-circle" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Nuevo registro</Text>
                  </LinearGradient>
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
                    <Text style={styles.saveButtonText}>Guardar</Text>
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              </Animated.View>
            )}

            <Text style={styles.sectionTitle}>Historial</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 40).duration(400)} style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name="fitness" size={16} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowDate}>{item.date}</Text>
              <Text style={styles.rowMain}>{item.weight} kg{item.height ? `  •  ${item.height} cm` : ''}</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg },
  greeting: { ...typography.body, marginTop: spacing.md },
  title: { ...typography.hero, marginBottom: spacing.lg },
  heroCard: { borderRadius: radius.xl, overflow: 'hidden', marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  heroGradient: { padding: spacing.xl },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  ringValue: { color: colors.text, fontSize: 26, fontWeight: '800' },
  ringUnit: { color: colors.textFaint, fontSize: 12, fontWeight: '600' },
  heroStats: { flex: 1, gap: spacing.md },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  statLabel: { ...typography.caption, flex: 1 },
  statValue: { color: colors.text, fontWeight: '700', fontSize: 14 },
  addButton: { borderRadius: radius.lg, overflow: 'hidden', marginBottom: spacing.lg },
  addButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  form: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  input: { backgroundColor: colors.cardAlt, color: colors.text, padding: 12, borderRadius: radius.md, marginBottom: spacing.sm },
  row3: { flexDirection: 'row', gap: spacing.sm },
  inputThird: { flex: 1 },
  saveButton: { backgroundColor: colors.primary, padding: 14, borderRadius: radius.md, alignItems: 'center', marginTop: spacing.xs },
  saveButtonText: { color: '#fff', fontWeight: '700' },
  sectionTitle: { ...typography.h2, marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.card, padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  rowIcon: { width: 34, height: 34, borderRadius: radius.full, backgroundColor: colors.primaryDim, alignItems: 'center', justifyContent: 'center' },
  rowDate: { ...typography.caption },
  rowMain: { color: colors.text, fontWeight: '700', fontSize: 15, marginTop: 2 },
  rowSmall: { ...typography.caption, marginTop: 2 },
  empty: { color: colors.textFaint, fontStyle: 'italic', textAlign: 'center', marginTop: spacing.xl },
});
