import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { MEALS, NUTRITION_TIPS } from '../data/meals';
import { MEAL_IMAGES, VOICE_CLIPS } from '../data/media';
import MediaBox from '../components/MediaBox';
import { colors, radius, spacing, typography, fonts } from '../theme';

const ACCENTS = [colors.gold, colors.success, colors.terracotta, colors.sky, colors.pink, colors.lime, colors.gold];

export default function NutricionScreen() {
  const [playingIndex, setPlayingIndex] = useState(null);

  const p1 = useAudioPlayer(VOICE_CLIPS.tip1);
  const p2 = useAudioPlayer(VOICE_CLIPS.tip2);
  const p3 = useAudioPlayer(VOICE_CLIPS.tip3);
  const p4 = useAudioPlayer(VOICE_CLIPS.tip4);
  const p5 = useAudioPlayer(VOICE_CLIPS.tip5);
  const players = [p1, p2, p3, p4, p5];
  const s1 = useAudioPlayerStatus(p1);
  const s2 = useAudioPlayerStatus(p2);
  const s3 = useAudioPlayerStatus(p3);
  const s4 = useAudioPlayerStatus(p4);
  const s5 = useAudioPlayerStatus(p5);
  const statuses = [s1, s2, s3, s4, s5];

  useEffect(() => {
    if (playingIndex !== null && statuses[playingIndex]?.didJustFinish) {
      setPlayingIndex(null);
    }
  }, [statuses[playingIndex ?? 0]?.didJustFinish]);

  const playTip = (index) => {
    players.forEach((p, i) => (i !== index ? p.pause() : null));
    players[index].seekTo(0);
    players[index].play();
    setPlayingIndex(index);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={MEALS}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ paddingBottom: 140 }}
        ListHeaderComponent={
          <View>
            <Animated.View entering={FadeIn.duration(500)}>
              <Text style={styles.label}>COMER PARA CRECER</Text>
              <Text style={styles.title}>Nutricion sin{'\n'}inflar el gasto.</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.scanCard}>
              <View style={styles.scanIconWrap}>
                <Ionicons name="scan" size={18} color={colors.lime} />
              </View>
              <Text style={styles.scanLabel}>TIPS DE VOLUMEN</Text>
              {NUTRITION_TIPS.map((t, i) => (
                <View key={i} style={styles.tipRow}>
                  <Text style={styles.tipNum}>{String(i + 1).padStart(2, '0')}</Text>
                  <Text style={styles.tip}>{t}</Text>
                  <TouchableOpacity onPress={() => playTip(i)} hitSlop={8}>
                    <Ionicons
                      name={playingIndex === i ? 'volume-high' : 'volume-medium-outline'}
                      size={17}
                      color={playingIndex === i ? colors.lime : colors.textFaint}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </Animated.View>

            <View style={styles.basketRow}>
              <Text style={styles.labelLime}>CANASTA COLOMBIANA</Text>
              <Text style={styles.basketText}>Base economica: huevos, avena, arroz, lentejas, pollo, atun y banano.</Text>
            </View>

            <Text style={styles.sectionTitle}>Recetas</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const accent = ACCENTS[index % ACCENTS.length];
          return (
            <Animated.View entering={FadeInDown.delay(index * 60).duration(400)} style={styles.card}>
              <MediaBox source={MEAL_IMAGES[item.id]} icon="restaurant" style={styles.mealImage} />
              <View style={styles.cardBody}>
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.mealBar, { backgroundColor: accent }]} />
                  <Text style={styles.mealName}>{item.name}</Text>
                  <View style={styles.caloriesBadge}>
                    <Text style={styles.calories}>{item.calorias}</Text>
                  </View>
                </View>
                <Text style={styles.label}>INGREDIENTES</Text>
                <Text style={styles.text}>{item.ingredientes.join(', ')}</Text>
                <Text style={styles.label}>PREPARACION</Text>
                <Text style={styles.text}>{item.prep}</Text>
              </View>
            </Animated.View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg },
  label: { ...typography.label, marginTop: spacing.sm },
  labelLime: { ...typography.labelLime },
  title: { ...typography.hero, fontSize: 30, marginTop: spacing.sm, marginBottom: spacing.lg },
  scanCard: { backgroundColor: colors.terracotta, borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.lg },
  scanIconWrap: { width: 34, height: 34, borderRadius: radius.full, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  scanLabel: { fontFamily: fonts.monoBold, fontSize: 10, letterSpacing: 1.4, color: colors.bg, marginBottom: spacing.md },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: 'rgba(17,18,15,0.15)' },
  tipNum: { fontFamily: fonts.mono, fontSize: 10, color: 'rgba(17,18,15,0.5)', marginTop: 2 },
  tip: { flex: 1, color: colors.bg, fontSize: 13, lineHeight: 18, opacity: 0.85 },
  basketRow: { borderWidth: 1, borderColor: colors.limeDim, backgroundColor: 'rgba(219,255,57,0.05)', borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl, gap: 6 },
  basketText: { color: colors.textDim, fontSize: 13, lineHeight: 18 },
  sectionTitle: { ...typography.h2, marginBottom: spacing.md },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, marginBottom: spacing.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  mealImage: { height: 150 },
  cardBody: { padding: spacing.lg },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  mealBar: { width: 4, height: 22, borderRadius: radius.full },
  mealName: { color: colors.text, fontFamily: fonts.displayMedium, fontSize: 16, flex: 1 },
  caloriesBadge: { backgroundColor: colors.limeDim, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  calories: { fontFamily: fonts.mono, color: colors.lime, fontSize: 10 },
  text: { color: colors.textDim, fontSize: 13, marginTop: 2, marginBottom: spacing.xs, lineHeight: 18 },
});
