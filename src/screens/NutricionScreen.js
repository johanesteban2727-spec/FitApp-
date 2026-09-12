import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { MEALS, NUTRITION_TIPS } from '../data/meals';
import { MEAL_IMAGES, VOICE_CLIPS } from '../data/media';
import MediaBox from '../components/MediaBox';
import { colors, radius, spacing, typography } from '../theme';

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
              <Text style={styles.greeting}>Aumentar de peso</Text>
              <Text style={styles.title}>Comidas para hipertrofia</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.tipsCard}>
              <LinearGradient colors={colors.gradientDark} style={styles.tipsGradient}>
                {NUTRITION_TIPS.map((t, i) => (
                  <View key={i} style={styles.tipRow}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                    <Text style={styles.tip}>{t}</Text>
                    <TouchableOpacity onPress={() => playTip(i)} hitSlop={8}>
                      <Ionicons
                        name={playingIndex === i ? 'volume-high' : 'volume-medium-outline'}
                        size={18}
                        color={playingIndex === i ? colors.primary : colors.textFaint}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </LinearGradient>
            </Animated.View>

            <Text style={styles.sectionTitle}>Recetas</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 60).duration(400)} style={styles.card}>
            <MediaBox source={MEAL_IMAGES[item.id]} icon="restaurant" style={styles.mealImage} />
            <View style={styles.cardBody}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.mealName}>{item.name}</Text>
                <View style={styles.caloriesBadge}>
                  <Text style={styles.calories}>{item.calorias}</Text>
                </View>
              </View>
              <Text style={styles.label}>Ingredientes</Text>
              <Text style={styles.text}>{item.ingredientes.join(', ')}</Text>
              <Text style={styles.label}>Preparacion</Text>
              <Text style={styles.text}>{item.prep}</Text>
            </View>
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
  tipsCard: { borderRadius: radius.lg, overflow: 'hidden', marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.border },
  tipsGradient: { padding: spacing.lg, gap: spacing.sm },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  tip: { flex: 1, color: colors.textDim, fontSize: 13, lineHeight: 18 },
  sectionTitle: { ...typography.h2, marginBottom: spacing.md },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, marginBottom: spacing.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  mealImage: { height: 150 },
  cardBody: { padding: spacing.lg },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  mealName: { color: colors.text, fontSize: 17, fontWeight: '800', flex: 1 },
  caloriesBadge: { backgroundColor: colors.primaryDim, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  calories: { color: colors.primary, fontSize: 11, fontWeight: '700' },
  label: { ...typography.caption, marginTop: spacing.sm },
  text: { color: colors.textDim, fontSize: 13, marginTop: 2, lineHeight: 18 },
});
