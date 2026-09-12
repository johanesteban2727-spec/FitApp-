import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BodyLog } from '../storage/storage';

export default function ProgresoScreen() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [arm, setArm] = useState('');
  const [chest, setChest] = useState('');
  const [log, setLog] = useState([]);

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
  };

  const last = log[0];
  const bmi = last?.weight && last?.height
    ? (last.weight / ((last.height / 100) ** 2)).toFixed(1)
    : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={styles.title}>Progreso</Text>

        {last && (
          <View style={styles.summary}>
            <Text style={styles.summaryText}>Ultimo peso: {last.weight} kg ({last.date})</Text>
            {bmi && <Text style={styles.summaryText}>IMC estimado: {bmi}</Text>}
          </View>
        )}

        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Peso (kg)" keyboardType="decimal-pad" value={weight} onChangeText={setWeight} />
          <TextInput style={styles.input} placeholder="Altura (cm) - opcional" keyboardType="decimal-pad" value={height} onChangeText={setHeight} />
          <TextInput style={styles.input} placeholder="Cintura (cm) - opcional" keyboardType="decimal-pad" value={waist} onChangeText={setWaist} />
          <TextInput style={styles.input} placeholder="Brazo (cm) - opcional" keyboardType="decimal-pad" value={arm} onChangeText={setArm} />
          <TextInput style={styles.input} placeholder="Pecho (cm) - opcional" keyboardType="decimal-pad" value={chest} onChangeText={setChest} />
          <TouchableOpacity style={styles.button} onPress={save}>
            <Text style={styles.buttonText}>Guardar registro</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Text style={styles.subtitle}>Historial</Text>
      <FlatList
        data={log}
        keyExtractor={(item, i) => item.date + i}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowDate}>{item.date}</Text>
            <Text>Peso: {item.weight} kg{item.height ? `  Altura: ${item.height} cm` : ''}</Text>
            {(item.waist || item.arm || item.chest) && (
              <Text style={styles.rowSmall}>
                {item.waist ? `Cintura: ${item.waist}cm ` : ''}
                {item.arm ? `Brazo: ${item.arm}cm ` : ''}
                {item.chest ? `Pecho: ${item.chest}cm` : ''}
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aun no tienes registros.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115', padding: 16 },
  title: { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginTop: 12, marginBottom: 6 },
  summary: { backgroundColor: '#1b1e26', padding: 12, borderRadius: 10, marginBottom: 10 },
  summaryText: { color: '#8fd3a5', fontSize: 14 },
  form: { gap: 8 },
  input: { backgroundColor: '#1b1e26', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 8 },
  button: { backgroundColor: '#e0393e', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  row: { backgroundColor: '#1b1e26', padding: 10, borderRadius: 8, marginBottom: 6 },
  rowDate: { color: '#aaa', fontSize: 12, marginBottom: 2 },
  rowSmall: { color: '#aaa', fontSize: 12, marginTop: 2 },
  empty: { color: '#666', fontStyle: 'italic' },
});
