import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  createColor,
  getColor,
  getPalette,
  getPaletteProgressive,
  getSwatches,
  isNativeModuleAvailable,
} from 'expo-color-thief-native';
import type { ColorThiefColorData } from 'expo-color-thief-native';

import { ColorRow, PaletteStrip } from '@/components/color-thief-test/color-row';
import { TestSection } from '@/components/color-thief-test/test-section';
import { useTimedRun } from '@/hooks/use-timed-run';

export default function ColorThiefTestScreen() {
  const uri = 'https://i.scdn.co/image/ab67616d0000b27326110f06ccf587b0a465f873';

  const color = useTimedRun(() => getColor(uri));

  const palette = useTimedRun(() => getPalette(uri));

  const paletteRgb = useTimedRun(() => getPalette(uri, { colorSpace: 'rgb' }));

  const paletteRegion = useTimedRun(() =>
    getPalette(uri, {
      colorCount: 5,
      region: { x: 0, y: 0.66, width: 1, height: 0.34 },
    }),
  );

  const swatches = useTimedRun(() => getSwatches(uri));

  const progressive = useTimedRun(async () => {
    const start = performance.now();
    const passes: { pass: number; ms: number; palette: ColorThiefColorData[] }[] = [];
    for await (const passPalette of getPaletteProgressive(uri)) {
      passes.push({ pass: passes.length + 1, ms: performance.now() - start, palette: passPalette });
    }
    return passes;
  });

  const created = useTimedRun(async () => createColor(232, 67, 147, 100));

  async function runAll() {
    await color.run();
    await palette.run();
    await paletteRgb.run();
    await paletteRegion.run();
    await swatches.run();
    await progressive.run();
    await created.run();
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.top}>
          <Image source={{ uri }} style={styles.image} />
          <View style={styles.topText}>
            <Text style={styles.heading}>Teste do color-thief</Text>
            <Text style={styles.note}>O tempo inclui o download da imagem.</Text>
            {!isNativeModuleAvailable && (
              <Text style={styles.warning}>Módulo nativo ausente neste binário: faça um novo build.</Text>
            )}
            <Pressable onPress={runAll} style={styles.runAll}>
              <Text style={styles.runAllText}>Rodar tudo</Text>
            </Pressable>
          </View>
        </View>

        <TestSection
          title="getColor"
          signature="getColor(uri)"
          status={color.status}
          times={color.times}
          error={color.error}
          onRun={color.run}
        >
          {color.status === 'done' && !color.data && <Text style={styles.empty}>retornou null</Text>}
          {color.data && <ColorRow color={color.data} />}
        </TestSection>

        <TestSection
          title="getPalette"
          signature="getPalette(uri) · colorCount 10 · oklch"
          status={palette.status}
          times={palette.times}
          error={palette.error}
          onRun={palette.run}
        >
          {palette.data && <PaletteStrip palette={palette.data} />}
          {palette.data?.map((item, index) => (
            <ColorRow key={index} color={item} label={`#${index + 1}`} />
          ))}
        </TestSection>

        <TestSection
          title="getPalette (rgb)"
          signature="getPalette(uri, { colorSpace: 'rgb' })"
          status={paletteRgb.status}
          times={paletteRgb.times}
          error={paletteRgb.error}
          onRun={paletteRgb.run}
        >
          {paletteRgb.data && <PaletteStrip palette={paletteRgb.data} />}
          {paletteRgb.data?.map((item, index) => (
            <ColorRow key={index} color={item} label={`#${index + 1}`} />
          ))}
        </TestSection>

        <TestSection
          title="getPalette (região)"
          signature="region { x: 0, y: 0.66, width: 1, height: 0.34 } · colorCount 5"
          status={paletteRegion.status}
          times={paletteRegion.times}
          error={paletteRegion.error}
          onRun={paletteRegion.run}
        >
          {paletteRegion.data && <PaletteStrip palette={paletteRegion.data} />}
          {paletteRegion.data?.map((item, index) => (
            <ColorRow key={index} color={item} label={`#${index + 1}`} />
          ))}
        </TestSection>

        <TestSection
          title="getSwatches"
          signature="getSwatches(uri)"
          status={swatches.status}
          times={swatches.times}
          error={swatches.error}
          onRun={swatches.run}
        >
          {swatches.data &&
            Object.entries(swatches.data).map(([name, swatch]) => (
              <ColorRow key={name} color={swatch} label={name} />
            ))}
        </TestSection>

        <TestSection
          title="getPaletteProgressive"
          signature="for await (const palette of getPaletteProgressive(uri))"
          status={progressive.status}
          times={progressive.times}
          error={progressive.error}
          onRun={progressive.run}
        >
          {progressive.data?.map((item) => (
            <View key={item.pass} style={styles.pass}>
              <Text style={styles.passTitle}>
                passe {item.pass} · {item.ms.toFixed(1)} ms · {item.palette.length} cores
              </Text>
              <PaletteStrip palette={item.palette} />
            </View>
          ))}
        </TestSection>

        <TestSection
          title="createColor"
          signature="createColor(232, 67, 147, 100)"
          status={created.status}
          times={created.times}
          error={created.error}
          onRun={created.run}
        >
          {created.data && <ColorRow color={created.data} />}
        </TestSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0b0b0f',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  top: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  topText: {
    flex: 1,
    gap: 8,
  },
  heading: {
    color: '#f2f2f5',
    fontSize: 20,
    fontWeight: '700',
  },
  note: {
    color: '#8b8b99',
    fontSize: 12,
  },
  warning: {
    color: '#f87171',
    fontSize: 12,
  },
  runAll: {
    alignSelf: 'flex-start',
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    cursor: 'pointer',
  },
  runAllText: {
    color: '#052e16',
    fontWeight: '700',
  },
  empty: {
    color: '#8b8b99',
    fontSize: 12,
  },
  pass: {
    gap: 6,
  },
  passTitle: {
    color: '#f2f2f5',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
});
