import { StyleSheet, Text, View } from 'react-native';

import type { ColorThiefColorData } from 'expo-color-thief-native';

export function ColorRow({ color, label }: { color: ColorThiefColorData; label?: string }) {
  return (
    <View style={styles.row}>
      <View style={[styles.swatch, { backgroundColor: color.hex }]} />
      <View style={styles.info}>
        <Text style={styles.title}>
          {label ? `${label} · ` : ''}
          {color.hex}
        </Text>
        <Text style={styles.line}>
          rgb({color.r}, {color.g}, {color.b}) · hsl({Math.round(color.hsl.h)}, {Math.round(color.hsl.s * 100)}%,{' '}
          {Math.round(color.hsl.l * 100)}%)
        </Text>
        <Text style={styles.line}>
          oklch({color.oklch.l.toFixed(3)} {color.oklch.c.toFixed(3)} {color.oklch.h.toFixed(1)})
        </Text>
        <Text style={styles.line}>
          texto {color.textColor} · {color.isDark ? 'escura' : 'clara'} · contraste branco{' '}
          {color.contrast.white.toFixed(2)} / preto {color.contrast.black.toFixed(2)}
        </Text>
        <Text style={styles.line}>
          população {color.population} · proporção {(color.proportion * 100).toFixed(2)}%
        </Text>
      </View>
    </View>
  );
}

export function PaletteStrip({ palette }: { palette: ColorThiefColorData[] }) {
  return (
    <View style={styles.strip}>
      {palette.map((color, index) => (
        <View
          key={index}
          style={[styles.stripItem, { backgroundColor: color.hex, flex: Math.max(color.proportion, 0.02) }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: '#f2f2f5',
    fontSize: 14,
    fontWeight: '600',
  },
  line: {
    color: '#8b8b99',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  strip: {
    flexDirection: 'row',
    height: 28,
    borderRadius: 8,
    overflow: 'hidden',
  },
  stripItem: {
    height: '100%',
  },
});
