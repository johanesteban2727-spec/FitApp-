import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Routines, WorkoutLog } from '../storage/storage';
import { DEFAULT_ROUTINES } from '../data/defaultRoutines';
import { ROUTINE_IMAGES, EXERCISE_IMAGES, EXERCISE_VIDEOS } from '../data/media';
import MediaBox from '../components/MediaBox';
import { colors, radius, spacing, typography } from '../theme';

export default function RutinasScreen() {
  const [routines, setRoutines] = useState([]);
  const [selected, setSelected] = useState(null);
  const [logInputs, setLogInputs] = useState({});
  const [newExName, setNewExName] = useState('');
  const [videoModal, setVideoModal] = useState(null);

  useEffect(() => {
    Routines.get(DEFAULT_ROUTINES).then(setRoutines);
  }, []);

  const persist = async (updated) => {
    setRoutines(updated);
    await Routines.save(updated);
  };

  const openRoutine = (r) => {
    setSelected(r);
    setLogInputs({});
  };

  const removeExercise = (exId) => {
    const updated = routines.map((r) =>
      r.id === selected.id ? { ...r, exercises: r.exercises.filter((e) => e.id !== exId) } : r
    );
    persist(updated);
    setSelected(updated.find((r) => r.id === selected.id));
  };

  const addExercise = () => {
    if (!newExName.trim()) return;
    const newEx = { id: `ex_${Date.now()}`, name: newExName.trim(), sets: 3, reps: '10-12', equipo: '' };
    const updated = routines.map((r) =>
      r.id === selected.id ? { ...r, exercises: [...r.exercises, newEx] } : r
    );
    persist(updated);
    setSelected(updated.find((r) => r.id === selected.id));
    setNewExName('');
  };

  const saveWorkout = async () => {
    const doneExercises = selected.exercises
      .filter((e) => logInputs[e.id] && logInputs[e.id].trim())
      .map((e) => ({ name: e.name, log: logInputs[e.id].trim() }));
    if (doneExercises.length === 0) {
      Alert.alert('Nada que guardar', 'Registra al menos un ejercicio (sets x reps x peso).');
      return;
    }
    await WorkoutLog.add({
      date: new Date().toISOString().slice(0, 10),
      routineName: selected.name,
      exercises: doneExercises,
    });
    Alert.alert('Guardado', 'Entrenamiento registrado. A seguir creciendo.');
    setLogInputs({});
  };

  if (selected) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <TouchableOpacity onPress={() => setSelected(null)} style={styles.backRow}>
          <Ionicons name="chevron-back" size={20} color={colors.primary} />
          <Text style={styles.back}>Rutinas</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{selected.name}</Text>

        <FlatList
          data={selected.exercises}
          keyExtractor={(e) => e.id}
          contentContainerStyle={{ paddingBottom: 140 }}
          renderItem={({ item, index }) => {
            const hasVideo = !!EXERCISE_VIDEOS[item.id];
            return (
              <Animated.View entering={FadeInDown.delay(index * 40).duration(400)} style={styles.exCard}>
                <MediaBox source={EXERCISE_IMAGES[item.id]} icon="barbell" style={styles.exImage}>
                  {hasVideo && (
                    <TouchableOpacity style={styles.playBadge} onPress={() => setVideoModal(EXERCISE_VIDEOS[item.id])}>
                      <Ionicons name="play" size={14} color="#fff" />
                    </TouchableOpacity>
                  )}
                </MediaBox>
                <TouchableOpacity onLongPress={() => removeExercise(item.id)} style={{ marginTop: spacing.sm }}>
                  <Text style={styles.exName}>{item.name}</Text>
                  <Text style={styles.exMeta}>{item.sets} series x {item.reps}{item.equipo ? `  •  ${item.equipo}` : ''}</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.logInput}
                  placeholder="ej: 10x20kg, 10x20kg, 8x22kg"
                  placeholderTextColor={colors.textFaint}
                  value={logInputs[item.id] || ''}
                  onChangeText={(t) => setLogInputs((prev) => ({ ...prev, [item.id]: t }))}
                />
              </Animated.View>
            );
          }}
          ListFooterComponent={
            <View style={styles.addRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Nuevo ejercicio..."
                placeholderTextColor={colors.textFaint}
                value={newExName}
                onChangeText={setNewExName}
              />
              <TouchableOpacity style={styles.addSmallButton} onPress={addExercise}>
                <Ionicons name="add" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          }
        />
        <Text style={styles.hint}>Manten presionado un ejercicio para borrarlo. Toca el video para ver la tecnica.</Text>
        <TouchableOpacity style={styles.saveWorkout} onPress={saveWorkout} activeOpacity={0.85}>
          <LinearGradient colors={colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.saveWorkoutGradient}>
            <Text style={styles.saveWorkoutText}>Guardar entrenamiento de hoy</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Modal visible={!!videoModal} transparent animationType="fade" onRequestClose={() => setVideoModal(null)}>
          <View style={styles.modalBg}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setVideoModal(null)}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            {videoModal && (
              <Video
                source={videoModal}
                style={styles.video}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                isLooping
              />
            )}
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={routines}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ paddingBottom: 140 }}
        ListHeaderComponent={
          <Animated.View entering={FadeIn.duration(500)}>
            <Text style={styles.greeting}>Entrenamiento</Text>
            <Text style={styles.title}>Elige tu rutina</Text>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
            <TouchableOpacity style={styles.routineCard} onPress={() => openRoutine(item)} activeOpacity={0.9}>
              <MediaBox source={ROUTINE_IMAGES[item.id]} icon="flame" style={styles.routineImage}>
                <LinearGradient colors={colors.gradientHero} style={StyleSheet.absoluteFill} />
                <View style={styles.routineOverlay}>
                  <Text style={styles.routineName}>{item.name}</Text>
                  <View style={styles.routineMetaRow}>
                    <Ionicons name="list" size={14} color={colors.textDim} />
                    <Text style={styles.exMeta}>{item.exercises.length} ejercicios</Text>
                  </View>
                </View>
              </MediaBox>
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg },
  greeting: { ...typography.body, marginTop: spacing.md },
  title: { ...typography.hero, marginBottom: spacing.lg },
  backRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  back: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  routineCard: { marginBottom: spacing.lg },
  routineImage: { height: 160, justifyContent: 'flex-end' },
  routineOverlay: { padding: spacing.lg },
  routineName: { color: colors.text, fontSize: 20, fontWeight: '800' },
  routineMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  exCard: { backgroundColor: colors.card, padding: spacing.md, borderRadius: radius.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  exImage: { height: 140 },
  playBadge: { position: 'absolute', top: spacing.sm, right: spacing.sm, width: 32, height: 32, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  exName: { color: colors.text, fontSize: 16, fontWeight: '700' },
  exMeta: { ...typography.caption, marginTop: 2 },
  logInput: { backgroundColor: colors.cardAlt, color: colors.text, padding: 10, borderRadius: radius.sm, marginTop: spacing.sm },
  addRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, alignItems: 'center' },
  input: { backgroundColor: colors.card, color: colors.text, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  addSmallButton: { backgroundColor: colors.cardAlt, width: 46, height: 46, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  hint: { ...typography.caption, marginVertical: spacing.sm, textAlign: 'center' },
  saveWorkout: { borderRadius: radius.lg, overflow: 'hidden' },
  saveWorkoutGradient: { padding: 16, alignItems: 'center' },
  saveWorkoutText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  modalBg: { flex: 1, backgroundColor: '#000000ee', alignItems: 'center', justifyContent: 'center' },
  modalClose: { position: 'absolute', top: 60, right: 24, zIndex: 10 },
  video: { width: '100%', height: 300 },
});
