/**
 * Espelha a API pública do pacote `colorthief` v3 (lokesh/color-thief),
 * exceto `observe()` (vídeo) e as variantes `*Sync`, que não existem
 * nativamente pois a bridge do React Native / Expo Modules é sempre
 * assíncrona (BitmapFactory + MMCQ rodam em Kotlin, fora da main thread,
 * e retornam via Promise).
 */

export type ColorSpace = 'rgb' | 'oklch';

/**
 * Área da imagem a analisar, em coordenadas normalizadas (0 a 1) a partir do
 * canto superior esquerdo. Passar da borda direita/inferior é cortado na
 * borda; x/y fora de [0, 1) ou width/height fora de (0, 1] geram erro.
 * `population` e `proportion` passam a valer para a região, não para a imagem.
 */
export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ColorThiefOptions {
  /** Número de cores na paleta (2–20). Ignorado por getColor. Default: 10 */
  colorCount?: number;
  /** Passo da amostragem: 1 = todo pixel, 10 = ~1 a cada 10. Default: 10 */
  quality?: number;
  /** Espaço de quantização. 'oklch' agrupa por percepção; 'rgb' é o algoritmo clássico. Default: 'oklch' */
  colorSpace?: ColorSpace;
  /** Ignora pixels praticamente brancos (bordas/fundos). Default: true */
  ignoreWhite?: boolean;
  /** Analisa só esta região da imagem. Default: imagem inteira */
  region?: Region;
  /** Cancela a extração em andamento (a Promise rejeita com `signal.reason`) */
  signal?: AbortSignal;
}

/** Opções como chegam ao Kotlin: tudo resolvido, sem `signal`. */
export interface NativeColorThiefOptions {
  colorCount: number;
  quality: number;
  colorSpace: ColorSpace;
  ignoreWhite: boolean;
  region?: Region;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  /** 0–360 */
  h: number;
  /** 0–1 */
  s: number;
  /** 0–1 */
  l: number;
}

export interface OKLCH {
  /** 0–1 */
  l: number;
  c: number;
  /** 0–360 */
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
 * Como o valor cruza a bridge nativa serializado, os mesmos dados já
 * calculados em Kotlin chegam como propriedades (em vez de métodos).
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
  /** 0–1, fatia proporcional do total amostrado (da região, se houver) */
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

/** Evento dos passes 1 e 2 do getPaletteProgressive: colors = [r, g, b, population, ...] */
export interface PassEvent {
  requestId: string;
  pass: number;
  colors: number[];
}

export interface NativeExpoColorThiefModule {
  getColor(
    imageUri: string,
    options: NativeColorThiefOptions,
    requestId: string
  ): Promise<ColorThiefColorData | null>;
  getPalette(
    imageUri: string,
    options: NativeColorThiefOptions,
    requestId: string
  ): Promise<ColorThiefColorData[]>;
  getSwatches(
    imageUri: string,
    options: NativeColorThiefOptions,
    requestId: string
  ): Promise<SwatchesResult>;
  /** Passe final do progressivo, no formato plano [r, g, b, population, ...] */
  getPaletteProgressive(
    imageUri: string,
    options: NativeColorThiefOptions,
    requestId: string
  ): Promise<number[]>;
  cancel(requestId: string): void;
  addListener(
    eventName: 'onPass',
    listener: (event: PassEvent) => void
  ): { remove: () => void };
}
