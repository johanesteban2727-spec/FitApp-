import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Routines, WorkoutLog, Profile, DEFAULT_PROFILE } from '../storage/storage';
import { DEFAULT_ROUTINES } from '../data/defaultRoutines';
import { ROUTINE_IMAGES, EXERCISE_IMAGES, EXERCISE_VIDEOS } from '../data/media';
import MediaBox from '../components/MediaBox';
import RestTimer from '../components/RestTimer';
import { colors, radius, spacing, typography, fonts } from '../theme';

const ACCENTS = [colors.lime, colors.sky, colors.pink, colors.gold, colors.terracotta];

function ExerciseVideoPlayer({ source }) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.play();
  });
  return <VideoView style={styles.video} player={player} nativeControls allowsFullscreen contentFit="contain" />;
}

export default function RutinasScreen() {
  const [routines, setRoutines] = useState([]);
  const [selected, setSelected] = useState(null);
  const [logInputs, setLogInputs] = useState({});
  const [newExName, setNewExName] = useState('');
  const [videoModal, setVideoModal] = useState(null);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    Routines.get(DEFAULT_ROUTINES).then(setRoutines);
    Profile.get().then(setProfile);
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
          <Ionicons name="chevron-back" size={18} color={colors.lime} />
          <Text style={styles.back}>RUTINAS</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{selected.name}</Text>

        <FlatList
          data={selected.exercises}
          keyExtractor={(e) => e.id}
          contentContainerStyle={{ paddingBottom: 140 }}
          renderItem={({ item, index }) => {
            const hasVideo = !!EXERCISE_VIDEOS[item.id];
            const accent = ACCENTS[index % ACCENTS.length];
            return (
              <Animated.View entering={FadeInDown.delay(index * 40).duration(400)} style={styles.exCard}>
                <View style={styles.exHeaderRow}>
                  <Text style={styles.exNum}>{String(index + 1).padStart(2, '0')}</Text>
                  <View style={[styles.exBar, { backgroundColor: accent }]} />
                  <TouchableOpacity onLongPress={() => removeExercise(item.id)} style={{ flex: 1 }}>
                    <Text style={styles.exName}>{item.name}</Text>
                    <Text style={styles.exMeta}>{item.sets} SERIES · {item.reps}{item.equipo ? `  ·  ${item.equipo}` : ''}</Text>
                  </TouchableOpacity>
                </View>
                <MediaBox source={EXERCISE_IMAGES[item.id]} icon="barbell" style={styles.exImage}>
                  {hasVideo && (
                    <TouchableOpacity style={[styles.playBadge, { backgroundColor: accent }]} onPress={() => setVideoModal(EXERCISE_VIDEOS[item.id])}>
                      <Ionicons name="play" size={14} color={colors.bg} />
                    </TouchableOpacity>
                  )}
                </MediaBox>
                <TextInput
                  style={styles.logInput}
                  placeholder="ej: 10x20kg, 10x20kg, 8x22kg"
                  placeholderTextColor={colors.textFaint}
                  value={logInputs[item.id] || ''}
                  onChangeText={(t) => setLogInputs((prev) => ({ ...prev, [item.id]: t }))}
                />
                <RestTimer seconds={profile.restSeconds} />
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
                <Ionicons name="add" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
          }
        />
        <Text style={styles.hint}>Manten presionado un ejercicio para borrarlo. Toca el video para ver la tecnica.</Text>
        <TouchableOpacity style={styles.saveWorkout} onPress={saveWorkout} activeOpacity={0.85}>
          <Text style={styles.saveWorkoutText}>GUARDAR ENTRENAMIENTO DE HOY</Text>
        </TouchableOpacity>

        <Modal visible={!!videoModal} transparent animationType="fade" onRequestClose={() => setVideoModal(null)}>
          <View style={styles.modalBg}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setVideoModal(null)}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            {videoModal && <ExerciseVideoPlayer key={videoModal} source={videoModal} />}
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
            <Text style={styles.label}>ENTRENAMIENTO DE HOY</Text>
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
                    <Ionicons name="list" size={12} color={colors.lime} />
                    <Text style={styles.routineMeta}>{item.exercises.length} EJERCICIOS</Text>
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
  label: { ...typography.labelLime, marginTop: spacing.md },
  title: { ...typography.hero, fontSize: 30, marginTop: spacing.sm, marginBottom: spacing.lg },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.md },
  back: { fontFamily: fonts.monoBold, fontSize: 11, letterSpacing: 1, color: colors.lime },
  routineCard: { marginBottom: spacing.lg },
  routineImage: { height: 170, justifyContent: 'flex-end', borderRadius: radius.xl },
  routineOverlay: { padding: spacing.lg },
  routineName: { fontFamily: fonts.display, fontSize: 21, color: colors.text, letterSpacing: -0.5 },
  routineMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  routineMeta: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, color: colors.textDim },
  exCard: { backgroundColor: colors.card, padding: spacing.md, borderRadius: radius.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  exHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  exNum: { fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint },
  exBar: { width: 4, height: 32, borderRadius: radius.full },
  exImage: { height: 140 },
  playBadge: { position: 'absolute', top: spacing.sm, right: spacing.sm, width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  exName: { color: colors.text, fontFamily: fonts.displayMedium, fontSize: 16 },
  exMeta: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.8, color: colors.textFaint, marginTop: 3 },
  logInput: { backgroundColor: colors.cardAlt, color: colors.text, padding: 10, borderRadius: radius.sm, marginTop: spacing.sm },
  addRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, alignItems: 'center' },
  input: { backgroundColor: colors.card, color: colors.text, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  addSmallButton: { backgroundColor: colors.cardAlt, width: 46, height: 46, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  hint: { ...typography.label, marginVertical: spacing.sm, textAlign: 'center', textTransform: 'none' },
  saveWorkout: { backgroundColor: colors.lime, borderRadius: radius.full, paddingVertical: 16, alignItems: 'center' },
  saveWorkoutText: { fontFamily: fonts.monoBold, fontSize: 11, letterSpacing: 1, color: colors.bg },
  modalBg: { flex: 1, backgroundColor: '#000000ee', alignItems: 'center', justifyContent: 'center' },
  modalClose: { position: 'absolute', top: 60, right: 24, zIndex: 10 },
  video: { width: '100%', height: 300 },
});
