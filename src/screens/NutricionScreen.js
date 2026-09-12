import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MEALS, NUTRITION_TIPS } from '../data/meals';

export default function NutricionScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Nutricion para aumentar</Text>
      <FlatList
        data={MEALS}
        keyExtractor={(m) => m.id}
        ListHeaderComponent={
          <View style={styles.tips}>
            {NUTRITION_TIPS.map((t, i) => (
              <Text key={i} style={styles.tip}>• {t}</Text>
            ))}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.mealName}>{item.name}</Text>
            <Text style={styles.calories}>{item.calorias}</Text>
            <Text style={styles.label}>Ingredientes:</Text>
            <Text style={styles.text}>{item.ingredientes.join(', ')}</Text>
            <Text style={styles.label}>Preparacion:</Text>
            <Text style={styles.text}>{item.prep}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115', padding: 16 },
  title: { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 12 },
  tips: { backgroundColor: '#1b1e26', padding: 12, borderRadius: 10, marginBottom: 12 },
  tip: { color: '#8fd3a5', fontSize: 13, marginBottom: 4 },
  card: { backgroundColor: '#1b1e26', padding: 14, borderRadius: 10, marginBottom: 10 },
  mealName: { color: '#fff', fontSize: 17, fontWeight: '700' },
  calories: { color: '#e0393e', fontSize: 13, marginTop: 2, marginBottom: 6, fontWeight: '600' },
  label: { color: '#aaa', fontSize: 12, marginTop: 6, fontWeight: '600' },
  text: { color: '#ddd', fontSize: 13, marginTop: 2 },
});
