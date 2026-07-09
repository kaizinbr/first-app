/**
 * Espelha a API pública do pacote `colorthief` v3 (lokesh/color-thief),
 * exceto `observe()` (vídeo) e as variantes `*Sync`, que não existem
 * nativamente pois a bridge do React Native / Expo Modules é sempre
 * assíncrona (JSI/TurboModules não muda isso: BitmapFactory + MMCQ
 * rodam em Kotlin, fora da main thread, e retornam via Promise).
 */

export type ColorSpace = 'rgb' | 'oklch';

export interface ColorThiefOptions {
  /** Número de cores na paleta (2–20). Ignorado por getColor. Default: 10 */
  colorCount?: number;
  /** Taxa de amostragem: 1 = todo pixel, 10 = 1 a cada 10. Default: 10 */
  quality?: number;
  /** Espaço de quantização. 'oklch' agrupa por percepção; 'rgb' é o algoritmo clássico. Default: 'oklch' */
  colorSpace?: ColorSpace;
  /** Ignora pixels praticamente brancos (bordas/fundos). Default: true */
  ignoreWhite?: boolean;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface OKLCH {
  l: number;
  c: number;
  h: number;
}

export interface ContrastInfo {
  /** Razão de contraste (WCAG) contra branco puro */
  white: number;
  /** Razão de contraste (WCAG) contra preto puro */
  black: number;
  /** '#ffffff' ou '#000000', o que der mais contraste */
  foreground: string;
}

/**
 * Objeto de cor "rico", equivalente ao Color do colorthief v3.
 * No JS o colorthief expõe métodos (.hex(), .rgb()...); aqui, como o
 * valor cruza a bridge nativa serializado, expomos os mesmos dados já
 * calculados nativamente em Kotlin como propriedades/getters no wrapper
 * TS (ver index.ts: createColorThiefColor).
 */
export interface ColorThiefColorData {
  r: number;
  g: number;
  b: number;
  hex: string;
  hsl: HSL;
  oklch: OKLCH;
  /** Contagem bruta de pixels amostrados que caíram nessa cor/caixa */
  population: number;
  /** 0–1, fatia proporcional do total amostrado */
  proportion: number;
  textColor: string;
  isDark: boolean;
  isLight: boolean;
  contrast: ContrastInfo;
}

export type SwatchName =
  | 'Vibrant'
  | 'Muted'
  | 'DarkVibrant'
  | 'DarkMuted'
  | 'LightVibrant'
  | 'LightMuted';

export type SwatchesResult = Partial<Record<SwatchName, ColorThiefColorData>>;

export interface NativeExpoColorThiefModule {
  getColor(imageUri: string, options?: ColorThiefOptions): Promise<ColorThiefColorData | null>;
  getPalette(imageUri: string, options?: ColorThiefOptions): Promise<ColorThiefColorData[]>;
  getSwatches(imageUri: string, options?: ColorThiefOptions): Promise<SwatchesResult>;
}
