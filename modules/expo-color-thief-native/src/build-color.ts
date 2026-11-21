import type { ColorThiefColorData } from './expo-color-thief.types';

function linearize(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

/**
 * Monta o mesmo objeto que o Kotlin devolve (ColorThiefColorRecord), com a
 * mesma matemática do ColorMath.kt. Usado por createColor e pelos passes do
 * getPaletteProgressive, que chegam do nativo só como [r, g, b, population].
 */
export function buildColor(
  r: number,
  g: number,
  b: number,
  population: number,
  proportion: number
): ColorThiefColorData {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightnessHsl = (max + min) / 2;

  let hue = 0;
  let saturation = 0;
  if (max !== min) {
    const delta = max - min;
    saturation = lightnessHsl > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
    hue *= 60;
  }

  const lr = linearize(r);
  const lg = linearize(g);
  const lb = linearize(b);

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bAxis = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  let oklchHue = (Math.atan2(bAxis, a) * 180) / Math.PI;
  if (oklchHue < 0) oklchHue += 360;

  const luminance = 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
  const contrastWhite = 1.05 / (luminance + 0.05);
  const contrastBlack = (luminance + 0.05) / 0.05;
  const textColor = contrastWhite >= contrastBlack ? '#ffffff' : '#000000';
  const isDark = contrastWhite >= contrastBlack;

  return {
    r,
    g,
    b,
    hex: '#' + [r, g, b].map((value) => value.toString(16).padStart(2, '0')).join(''),
    hsl: { h: hue, s: saturation, l: lightnessHsl },
    oklch: { l: lightness, c: Math.sqrt(a * a + bAxis * bAxis), h: oklchHue },
    population,
    proportion,
    textColor,
    isDark,
    isLight: !isDark,
    contrast: { white: contrastWhite, black: contrastBlack, foreground: textColor },
  };
}
