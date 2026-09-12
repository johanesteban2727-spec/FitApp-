import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  BODY_LOG: '@fit/bodylog',
  WORKOUT_LOG: '@fit/workoutlog',
  ROUTINES: '@fit/routines',
  PROFILE: '@fit/profile',
};

export const DEFAULT_PROFILE = {
  name: 'Johan',
  metaPeso: null,
  unidades: 'kg',
  restSeconds: 90,
};

async function getJSON(key, fallback) {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

async function setJSON(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const BodyLog = {
  getAll: () => getJSON(KEYS.BODY_LOG, []),
  add: async (entry) => {
    const all = await BodyLog.getAll();
    all.push(entry);
    await setJSON(KEYS.BODY_LOG, all);
    return all;
  },
};

export const WorkoutLog = {
  getAll: () => getJSON(KEYS.WORKOUT_LOG, []),
  add: async (entry) => {
    const all = await WorkoutLog.getAll();
    all.push(entry);
    await setJSON(KEYS.WORKOUT_LOG, all);
    return all;
  },
};

export const Routines = {
  get: (seed) => getJSON(KEYS.ROUTINES, seed),
  save: (routines) => setJSON(KEYS.ROUTINES, routines),
};

export const Profile = {
  get: () => getJSON(KEYS.PROFILE, DEFAULT_PROFILE),
  save: (profile) => setJSON(KEYS.PROFILE, profile),
};
