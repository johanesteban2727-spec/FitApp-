import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Routines, WorkoutLog } from '../storage/storage';
import { DEFAULT_ROUTINES } from '../data/defaultRoutines';

export default function RutinasScreen() {
  const [routines, setRoutines] = useState([]);
  const [selected, setSelected] = useState(null);
  const [logInputs, setLogInputs] = useState({});
  const [newExName, setNewExName] = useState('');

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
    Alert.alert('Guardado', 'Entrenamiento registrado.');
    setLogInputs({});
  };

  if (selected) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <TouchableOpacity onPress={() => setSelected(null)}>
          <Text style={styles.back}>{'< Rutinas'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{selected.name}</Text>

        <FlatList
          data={selected.exercises}
          keyExtractor={(e) => e.id}
          renderItem={({ item }) => (
            <View style={styles.exCard}>
              <TouchableOpacity onLongPress={() => removeExercise(item.id)} style={{ flex: 1 }}>
                <Text style={styles.exName}>{item.name}</Text>
                <Text style={styles.exMeta}>{item.sets} series x {item.reps}{item.equipo ? ` - ${item.equipo}` : ''}</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.logInput}
                placeholder="ej: 10x20kg, 10x20kg, 8x22kg"
                placeholderTextColor="#666"
                value={logInputs[item.id] || ''}
                onChangeText={(t) => setLogInputs((prev) => ({ ...prev, [item.id]: t }))}
              />
            </View>
          )}
          ListFooterComponent={
            <View style={styles.addRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Nuevo ejercicio..."
                value={newExName}
                onChangeText={setNewExName}
              />
              <TouchableOpacity style={styles.addButton} onPress={addExercise}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          }
        />
        <Text style={styles.hint}>Manten presionado un ejercicio para borrarlo.</Text>
        <TouchableOpacity style={styles.button} onPress={saveWorkout}>
          <Text style={styles.buttonText}>Guardar entrenamiento de hoy</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Rutinas</Text>
      <FlatList
        data={routines}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.routineCard} onPress={() => openRoutine(item)}>
            <Text style={styles.routineName}>{item.name}</Text>
            <Text style={styles.exMeta}>{item.exercises.length} ejercicios</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115', padding: 16 },
  title: { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 12 },
  back: { color: '#e0393e', fontSize: 16, marginBottom: 8 },
  routineCard: { backgroundColor: '#1b1e26', padding: 14, borderRadius: 10, marginBottom: 10 },
  routineName: { color: '#fff', fontSize: 18, fontWeight: '600' },
  exCard: { backgroundColor: '#1b1e26', padding: 12, borderRadius: 8, marginBottom: 8 },
  exName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  exMeta: { color: '#aaa', fontSize: 12, marginTop: 2 },
  logInput: { backgroundColor: '#0f1115', color: '#fff', padding: 8, borderRadius: 6, marginTop: 8 },
  addRow: { flexDirection: 'row', gap: 8, marginTop: 8, alignItems: 'center' },
  input: { backgroundColor: '#1b1e26', color: '#fff', padding: 10, borderRadius: 8 },
  addButton: { backgroundColor: '#2a2e38', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, marginLeft: 8 },
  hint: { color: '#666', fontSize: 12, marginVertical: 8, textAlign: 'center' },
  button: { backgroundColor: '#e0393e', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
