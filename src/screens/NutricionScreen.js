import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { MEALS, NUTRITION_TIPS } from '../data/meals';
import { MEAL_IMAGES, VOICE_CLIPS } from '../data/media';
import MediaBox from '../components/MediaBox';
import { colors, radius, spacing, typography, fonts } from '../theme';

const ACCENTS = [colors.gold, colors.success, colors.terracotta, colors.sky, colors.pink, colors.lime, colors.gold];
const SCREEN_WIDTH = Dimensions.get('window').width;
const TIP_CARD_WIDTH = SCREEN_WIDTH - spacing.lg * 2 - spacing.xl * 2;

export default function NutricionScreen() {
  const [playingIndex, setPlayingIndex] = useState(null);
  const [activeTip, setActiveTip] = useState(0);
  const tipListRef = useRef(null);

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
            <Animated.View entering={FadeIn.duration(500)} style={{ paddingHorizontal: spacing.lg }}>
              <Text style={styles.label}>COMER PARA CRECER</Text>
              <Text style={styles.title}>Nutricion sin{'\n'}inflar el gasto.</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <View style={styles.tipsHeaderRow}>
                <View style={styles.scanIconWrap}>
                  <Ionicons name="scan" size={16} color={colors.lime} />
                </View>
                <Text style={styles.tipsHeaderLabel}>TIPS DE VOLUMEN</Text>
                <Text style={styles.tipsCounter}>{activeTip + 1}/{NUTRITION_TIPS.length}</Text>
              </View>
              <FlatList
                ref={tipListRef}
                data={NUTRITION_TIPS}
                keyExtractor={(_, i) => `tip-${i}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
                snapToInterval={TIP_CARD_WIDTH + spacing.md}
                decelerationRate="fast"
                onMomentumScrollEnd={(e) => {
                  const i = Math.round(e.nativeEvent.contentOffset.x / (TIP_CARD_WIDTH + spacing.md));
                  setActiveTip(i);
                }}
                renderItem={({ item, index }) => (
                  <View style={[styles.tipCard, { width: TIP_CARD_WIDTH }]}>
                    <Text style={styles.tipNum}>{String(index + 1).padStart(2, '0')}</Text>
                    <Text style={styles.tip}>{item}</Text>
                    <TouchableOpacity onPress={() => playTip(index)} style={styles.tipPlayButton}>
                      <Ionicons
                        name={playingIndex === index ? 'volume-high' : 'volume-medium-outline'}
                        size={16}
                        color={colors.bg}
                      />
                      <Text style={styles.tipPlayText}>ESCUCHAR</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              <View style={styles.dotsRow}>
                {NUTRITION_TIPS.map((_, i) => (
                  <View key={i} style={[styles.dot, i === activeTip && styles.dotActive]} />
                ))}
              </View>
            </Animated.View>

            <View style={[styles.basketRow, { marginHorizontal: spacing.lg }]}>
              <Text style={styles.labelLime}>CANASTA COLOMBIANA</Text>
              <Text style={styles.basketText}>Base economica: huevos, avena, arroz, lentejas, pollo, atun y banano.</Text>
            </View>

            <Text style={[styles.sectionTitle, { marginHorizontal: spacing.lg }]}>Recetas</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const accent = ACCENTS[index % ACCENTS.length];
          return (
            <Animated.View entering={FadeInDown.delay(index * 60).duration(400)} style={[styles.card, { marginHorizontal: spacing.lg }]}>
              <MediaBox source={MEAL_IMAGES[item.id]} icon="restaurant" style={styles.mealImage}>
                <View style={styles.caloriesBadge}>
                  <Text style={styles.calories}>{item.calorias}</Text>
                </View>
              </MediaBox>
              <View style={styles.cardBody}>
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.mealBar, { backgroundColor: accent }]} />
                  <Text style={styles.mealName}>{item.name}</Text>
                </View>
                <Text style={styles.text}>{item.ingredientes.join(' · ')}</Text>
                <Text style={styles.prepText} numberOfLines={3}>{item.prep}</Text>
              </View>
            </Animated.View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  label: { ...typography.label, marginTop: spacing.sm },
  labelLime: { ...typography.labelLime },
  title: { ...typography.hero, fontSize: 30, marginTop: spacing.sm, marginBottom: spacing.lg },
  tipsHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  scanIconWrap: { width: 26, height: 26, borderRadius: radius.full, backgroundColor: colors.limeDim, alignItems: 'center', justifyContent: 'center' },
  tipsHeaderLabel: { ...typography.labelLime, flex: 1 },
  tipsCounter: { fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint },
  tipCard: { backgroundColor: colors.terracotta, borderRadius: radius.xl, padding: spacing.xl, justifyContent: 'space-between', minHeight: 150 },
  tipNum: { fontFamily: fonts.display, fontSize: 34, color: 'rgba(17,18,15,0.35)' },
  tip: { color: colors.bg, fontSize: 16, lineHeight: 22, fontFamily: fonts.displayMedium, marginTop: spacing.sm },
  tipPlayButton: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: colors.bg, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 8, marginTop: spacing.lg },
  tipPlayText: { fontFamily: fonts.monoBold, fontSize: 10, letterSpacing: 1, color: colors.lime },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.md, marginBottom: spacing.xl },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.lime, width: 18 },
  basketRow: { borderWidth: 1, borderColor: colors.limeDim, backgroundColor: 'rgba(219,255,57,0.05)', borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl, gap: 6 },
  basketText: { color: colors.textDim, fontSize: 13, lineHeight: 18 },
  sectionTitle: { ...typography.h2, marginBottom: spacing.md },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, marginBottom: spacing.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  mealImage: { height: 180 },
  caloriesBadge: { position: 'absolute', top: spacing.sm, right: spacing.sm, backgroundColor: colors.bg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.full },
  calories: { fontFamily: fonts.monoBold, color: colors.lime, fontSize: 10 },
  cardBody: { padding: spacing.lg },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  mealBar: { width: 4, height: 20, borderRadius: radius.full },
  mealName: { color: colors.text, fontFamily: fonts.displayMedium, fontSize: 17, flex: 1 },
  text: { color: colors.lime, fontSize: 11, fontFamily: fonts.mono, marginBottom: spacing.sm },
  prepText: { color: colors.textDim, fontSize: 13, lineHeight: 19 },
});
