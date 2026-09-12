import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle, Line } from 'react-native-svg';
import { colors, fonts } from '../theme';

// Minimal line chart: takes an array of numbers and draws a smooth-ish
// polyline with a dot on the last point. No external chart lib needed.
export default function LineChart({ data, height = 90, color = colors.lime, unit = '' }) {
  if (!data || data.length < 2) {
    return (
      <View style={[styles.empty, { height }]}>
        <Text style={styles.emptyText}>Agrega al menos 2 registros para ver la tendencia</Text>
      </View>
    );
  }

  const width = 300;
  const padding = 10;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const last = data[data.length - 1];
  const lastPoint = points[points.length - 1].split(',').map(Number);

  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke={colors.border} strokeWidth={1} strokeDasharray="4,4" />
        <Polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx={lastPoint[0]} cy={lastPoint[1]} r={4} fill={color} />
      </Svg>
      <View style={styles.rangeRow}>
        <Text style={styles.rangeText}>{min}{unit}</Text>
        <Text style={styles.lastText}>{last}{unit}</Text>
        <Text style={styles.rangeText}>{max}{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textFaint, fontSize: 12, textAlign: 'center' },
  rangeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  rangeText: { fontFamily: fonts.mono, fontSize: 9, color: colors.textFaint },
  lastText: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.lime },
});
