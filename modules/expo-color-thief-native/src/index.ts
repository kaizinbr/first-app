import { buildColor } from './build-color';
import NativeModule from './expo-color-thief-module';
import type {
  ColorThiefColorData,
  ColorThiefOptions,
  RGB,
  SwatchesResult,
} from './expo-color-thief.types';
import { callNative, progressivePalette, resolveOptions } from './native-calls';

/** Indica se o binário instalado contém a implementação nativa. */
export const isNativeModuleAvailable = NativeModule !== null;

export type {
  ColorSpace,
  ColorThiefOptions,
  ColorThiefColorData,
  ContrastInfo,
  HSL,
  OKLCH,
  Region,
  RGB,
  SwatchesResult,
  SwatchName,
} from './expo-color-thief.types';

/**
 * Cor dominante da imagem. Equivalente a getColor() do colorthief.
 * Internamente usa uma paleta de 5 cores (`colorCount` é ignorado).
 */
export async function getColor(
  imageUri: string,
  options?: ColorThiefOptions
): Promise<ColorThiefColorData | null> {
  const native = NativeModule;
  if (!native) return null;
  const resolved = resolveOptions(options);
  return callNative(options?.signal, (requestId) => native.getColor(imageUri, resolved, requestId));
}

/** Paleta de N cores. Equivalente a getPalette(). */
export async function getPalette(
  imageUri: string,
  options?: ColorThiefOptions
): Promise<ColorThiefColorData[]> {
  const native = NativeModule;
  if (!native) return [];
  const resolved = resolveOptions(options);
  return callNative(options?.signal, (requestId) => native.getPalette(imageUri, resolved, requestId));
}

/**
 * Swatches semânticos (Vibrant, Muted, DarkVibrant, DarkMuted, LightVibrant,
 * LightMuted), no mesmo espírito do getSwatches() do colorthief v3 / do
 * androidx.palette.graphics.Palette, do qual a heurística nativa foi
 * inspirada para manter velocidade em Android.
 */
export async function getSwatches(
  imageUri: string,
  options?: ColorThiefOptions
): Promise<SwatchesResult> {
  const native = NativeModule;
  if (!native) return {};
  const resolved = resolveOptions(options);
  return callNative(options?.signal, (requestId) => native.getSwatches(imageUri, resolved, requestId));
}

/**
 * Paleta em 3 passes (grosso -> médio -> final) sobre uma única decodificação
 * da imagem: dá pra pintar a UI com o primeiro passe e refinar nos seguintes.
 * O último passe é equivalente ao getPalette().
 */
export async function* getPaletteProgressive(
  imageUri: string,
  options?: ColorThiefOptions
): AsyncGenerator<ColorThiefColorData[]> {
  const resolved = resolveOptions(options);
  yield* progressivePalette(imageUri, resolved, options?.signal);
}

/** Cria um objeto de cor completo a partir de r, g, b (0–255), sem passar pelo nativo. */
export function createColor(r: number, g: number, b: number, population = 0): ColorThiefColorData {
  const clamp = (value: number) => Math.min(255, Math.max(0, Math.round(value)));
  return buildColor(clamp(r), clamp(g), clamp(b), population, 0);
}

/** Utilitário puro em JS, sem custo de bridge — igual ao do colorthief. */
export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (v: number) => v.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Utilitário puro em JS, sem custo de bridge — igual ao do colorthief. */
export function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

// Observação: `observe()` (leitura reativa de <video>) foi propositalmente
// deixado de fora — não existe DOM/vídeo no Android nativo e não é um
// requisito do projeto.
