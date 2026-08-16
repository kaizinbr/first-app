import NativeModule from './ExpoColorThiefModule';
import type {
  ColorThiefOptions,
  ColorThiefColorData,
  SwatchesResult,
  RGB,
} from './ExpoColorThief.types';

/** Indica se o binário instalado contém a implementação nativa. */
export const isNativeModuleAvailable = NativeModule !== null;

export type {
  ColorSpace,
  ColorThiefOptions,
  ColorThiefColorData,
  SwatchesResult,
  SwatchName,
  RGB,
  HSL,
  OKLCH,
  ContrastInfo,
} from './ExpoColorThief.types';

/**
 * Cor dominante da imagem. Equivalente a getColor()/getColorSync() do colorthief.
 * `quality` afeta o cálculo do dominante mesmo sem colorCount.
 */
export async function getColor(
  imageUri: string,
  options?: ColorThiefOptions
): Promise<ColorThiefColorData | null> {
  return NativeModule?.getColor(imageUri, options ?? {}) ?? null;
}

/** Paleta de N cores. Equivalente a getPalette()/getPaletteSync(). */
export async function getPalette(
  imageUri: string,
  options?: ColorThiefOptions
): Promise<ColorThiefColorData[]> {
  return NativeModule?.getPalette(imageUri, options ?? {}) ?? [];
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
  return NativeModule?.getSwatches(imageUri, options ?? {}) ?? {};
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
