import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Profile, DEFAULT_PROFILE } from '../storage/storage';
import { colors, radius, spacing, typography, fonts } from '../theme';

const REST_OPTIONS = [60, 90, 120, 180];

export default function PerfilScreen() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [name, setName] = useState('');
  const [metaPeso, setMetaPeso] = useState('');

  useEffect(() => {
    Profile.get().then((p) => {
      setProfile(p);
      setName(p.name || '');
      setMetaPeso(p.metaPeso ? String(p.metaPeso) : '');
    });
  }, []);

  const update = (patch) => {
    const next = { ...profile, ...patch };
    setProfile(next);
    Profile.save(next);
  };

  const saveName = () => update({ name: name.trim() || 'Johan' });
  const saveMeta = () => update({ metaPeso: metaPeso ? Number(metaPeso) : null });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <Animated.View entering={FadeIn.duration(500)}>
          <Text style={styles.label}>TU CUENTA</Text>
          <Text style={styles.title}>Perfil</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(profile.name || 'J').slice(0, 1).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>NOMBRE</Text>
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                onBlur={saveName}
                placeholder="Tu nombre"
                placeholderTextColor={colors.textFaint}
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(140).springify()} style={styles.card}>
          <Text style={styles.label}>META DE PESO</Text>
          <View style={styles.metaRow}>
            <TextInput
              style={styles.metaInput}
              value={metaPeso}
              onChangeText={setMetaPeso}
              onBlur={saveMeta}
              keyboardType="decimal-pad"
              placeholder="ej: 75"
              placeholderTextColor={colors.textFaint}
            />
            <Text style={styles.metaUnit}>KG</Text>
          </View>
          <Text style={styles.hint}>Se usa para calcular tu progreso hacia el objetivo.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.card}>
          <Text style={styles.label}>DESCANSO ENTRE SERIES</Text>
          <View style={styles.restRow}>
            {REST_OPTIONS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.restChip, profile.restSeconds === s && styles.restChipActive]}
                onPress={() => update({ restSeconds: s })}
              >
                <Text style={[styles.restChipText, profile.restSeconds === s && styles.restChipTextActive]}>{s}S</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(260).springify()} style={styles.footer}>
          <Ionicons name="flash" size={14} color={colors.lime} />
          <Text style={styles.footerText}>PULSO — TU PROCESO, MEDIDO.</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg },
  label: { ...typography.label, marginTop: spacing.sm },
  title: { ...typography.hero, fontSize: 30, marginTop: spacing.sm, marginBottom: spacing.lg },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 52, height: 52, borderRadius: radius.full, backgroundColor: colors.terracotta, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.display, fontSize: 20, color: colors.bg },
  nameInput: { fontFamily: fonts.displayMedium, fontSize: 18, color: colors.text, marginTop: 4, paddingVertical: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: spacing.sm },
  metaInput: { fontFamily: fonts.display, fontSize: 26, color: colors.text, minWidth: 60 },
  metaUnit: { fontFamily: fonts.mono, fontSize: 12, color: colors.textFaint },
  hint: { color: colors.textFaint, fontSize: 11, marginTop: spacing.sm },
  restRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  restChip: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  restChipActive: { backgroundColor: colors.lime, borderColor: colors.lime },
  restChipText: { fontFamily: fonts.mono, fontSize: 11, color: colors.textDim },
  restChipTextActive: { color: colors.bg, fontFamily: fonts.monoBold },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: spacing.xl },
  footerText: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1.2, color: colors.textFaint },
});
