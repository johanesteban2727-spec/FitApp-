// Rutina base: hipertrofia + funcional, todo entrenable en casa
// con mancuernas, barra y peso libre. Editable desde la app.
let uid = 0;
const ex = (name, sets, reps, equipo) => ({ id: `ex${uid++}`, name, sets, reps, equipo });

export const DEFAULT_ROUTINES = [
  {
    id: 'r1',
    name: 'Tren Superior (Hipertrofia)',
    exercises: [
      ex('Press banca con mancuernas', 4, '8-10', 'Mancuernas'),
      ex('Remo con barra', 4, '8-10', 'Barra'),
      ex('Press militar con mancuernas', 3, '10-12', 'Mancuernas'),
      ex('Curl de biceps con barra', 3, '10-12', 'Barra'),
      ex('Extension de triceps con mancuerna', 3, '10-12', 'Mancuerna'),
      ex('Face pull con banda / remo al menton', 3, '12-15', 'Banda o mancuernas'),
    ],
  },
  {
    id: 'r2',
    name: 'Tren Inferior (Hipertrofia)',
    exercises: [
      ex('Sentadilla con barra', 4, '8-10', 'Barra'),
      ex('Peso muerto rumano con barra', 4, '8-10', 'Barra'),
      ex('Zancadas con mancuernas', 3, '10-12 c/pierna', 'Mancuernas'),
      ex('Elevacion de talones (gemelos)', 4, '15-20', 'Mancuernas'),
      ex('Hip thrust con barra', 3, '10-12', 'Barra'),
    ],
  },
  {
    id: 'r3',
    name: 'Full Body Funcional (Casa)',
    exercises: [
      ex('Burpees', 4, '30-45 seg', 'Peso corporal'),
      ex('Sentadilla goblet con mancuerna', 3, '12-15', 'Mancuerna'),
      ex('Flexiones de pecho', 3, 'Al fallo', 'Peso corporal'),
      ex('Swing con mancuerna (estilo kettlebell)', 3, '15', 'Mancuerna'),
      ex('Plancha', 3, '30-60 seg', 'Peso corporal'),
      ex('Mountain climbers', 3, '30 seg', 'Peso corporal'),
    ],
  },
];
