import { ColorPalette, Palette } from "@/lib/types";
import chroma from "chroma-js";
import type { ColorThiefColorData } from "expo-color-thief-native";

interface BackgroundColorResult {
    background: string;
    textColor: string;
}

interface GradientBackgroundColorResult extends BackgroundColorResult {
    accent: string;
    palette: [string, string, string];
}

const FALLBACK_COLOR = "#8065ef";
const TARGET_BACKGROUND_LUMINANCE = 0.22;
const MIN_WHITE_CONTRAST = 4.5;

const TARGET_LIGHTNESS = 0.4;
const LIGHTNESS_SPREAD = 0.34;
const MIN_LIGHTNESS = 0.16;
const MAX_LIGHTNESS = 0.55;

// Abaixo disso, o hue é ruído numérico (instável perto do cinza/preto/branco)
// — não confiamos nele pra reconstruir cor.
const MIN_SATURATION_TO_TRUST_HUE = 0.12;
const SATURATION_TARGET = 0.35;

const SECONDARY_HUE_TARGET = 28;
const SECONDARY_HUE_SPREAD = 32;
const SECONDARY_LIGHTNESS_TARGET = 0.12;
const SECONDARY_LIGHTNESS_SPREAD = 0.16;
const SECONDARY_SATURATION_BONUS = 0.12;

const MIN_DELTA_E_FROM_BASE = 12; // evita escolher cor quase idêntica ao bg (gradiente "sumido")
const MIN_ACCEPTABLE_GRADIENT_SCORE = 0.25;

function tentScore(value: number, target: number, spread: number): number {
    return Math.max(0, 1 - Math.abs(value - target) / spread);
}

function hueDistance(a: number, b: number): number {
    const delta = Math.abs(a - b) % 360;
    return Math.min(delta, 360 - delta);
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = h / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let r = 0,
        g = 0,
        b = 0;
    if (hp < 1) [r, g, b] = [c, x, 0];
    else if (hp < 2) [r, g, b] = [x, c, 0];
    else if (hp < 3) [r, g, b] = [0, c, x];
    else if (hp < 4) [r, g, b] = [0, x, c];
    else if (hp < 5) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    const m = l - c / 2;
    return [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255),
    ];
}

function rgbToHex(r: number, g: number, b: number): string {
    const h = (v: number) => v.toString(16).padStart(2, "0");
    return `#${h(r)}${h(g)}${h(b)}`;
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function safeLuminance(hex: string) {
    try {
        return chroma(hex).luminance();
    } catch {
        return 0;
    }
}

function isUsableColor(hex?: string) {
    if (!hex) {
        return false;
    }

    const normalized = hex.toLowerCase();
    return normalized !== "#000000" && normalized !== "#ffffff";
}

function scoreBackgroundColor(color: ColorPalette[number], index: number) {
    const luminance = safeLuminance(color.hex);
    const proportion = clamp(color.proportion ?? 0, 0, 1);
    const saturation = clamp(color.hsl?.s ?? 0, 0, 1);
    const whiteContrast = clamp(((color.contrast?.white ?? 0) - 3) / 9, 0, 1);
    const luminanceFit =
        1 -
        clamp(
            Math.abs(luminance - TARGET_BACKGROUND_LUMINANCE) /
                TARGET_BACKGROUND_LUMINANCE,
            0,
            1,
        );
    const rankBias = 1 - clamp(index / 6, 0, 1) * 0.1;

    return (
        proportion * 0.5 +
        whiteContrast * 0.25 +
        luminanceFit * 0.2 +
        saturation * 0.05 * rankBias
    );
}

function scoreGradientPair(
    base: ColorPalette[number],
    candidate: ColorPalette[number],
    index: number,
) {
    const baseHue = base.hsl?.h ?? 0;
    const candidateHue = candidate.hsl?.h ?? 0;
    const hueScore = tentScore(
        hueDistance(baseHue, candidateHue),
        SECONDARY_HUE_TARGET,
        SECONDARY_HUE_SPREAD,
    );
    const lightnessScore = tentScore(
        candidate.hsl?.l ?? 0,
        SECONDARY_LIGHTNESS_TARGET,
        SECONDARY_LIGHTNESS_SPREAD,
    );
    const saturationBonus =
        clamp(candidate.hsl?.s ?? 0, 0, 1) * SECONDARY_SATURATION_BONUS;
    const dominanceScore = clamp(candidate.proportion ?? 0, 0, 1);
    const rankBias = 1 - clamp(index / 6, 0, 1) * 0.08;

    return (
        dominanceScore * 0.35 +
        hueScore * 0.3 +
        lightnessScore * 0.25 +
        saturationBonus * rankBias * 0.1
    );
}

function normalizeBackgroundColor(hex: string) {
    try {
        const color = chroma(hex);
        const luminance = color.luminance();

        if (luminance > 0.35) {
            return color.luminance(TARGET_BACKGROUND_LUMINANCE).hex();
        }

        if (luminance < 0.08) {
            return color.luminance(0.12).hex();
        }

        if (chroma.contrast(color.hex(), "#ffffff") < MIN_WHITE_CONTRAST) {
            return color.luminance(0.18).hex();
        }

        return color.hex();
    } catch {
        return FALLBACK_COLOR;
    }
}

function buildPaletteFromPair(
    background: string,
    accent: string,
): [string, string, string] {
    return chroma.scale([background, accent]).mode("rgb").colors(3) as [
        string,
        string,
        string,
    ];
}

function getBestColorCandidate(colors: ColorPalette) {
    let bestColor: ColorThiefColorData | null = null;
    let bestScore = -Infinity;

    for (let index = 0; index < colors.length; index += 1) {
        const color = colors[index];

        if (!color || !isUsableColor(color.hex)) {
            continue;
        }

        const dominance = clamp(color.proportion ?? 0, 0, 1);
        const luminance = safeLuminance(color.hex);
        const whiteContrast = clamp(
            ((color.contrast?.white ?? 0) - 3) / 9,
            0,
            1,
        );
        const luminanceFit =
            1 -
            clamp(
                Math.abs(luminance - TARGET_BACKGROUND_LUMINANCE) /
                    TARGET_BACKGROUND_LUMINANCE,
                0,
                1,
            );
        const saturation = clamp(color.hsl?.s ?? 0, 0, 1);
        const rankBias = 1 - clamp(index / 6, 0, 1) * 0.1;

        const score =
            dominance * 0.5 +
            whiteContrast * 0.25 +
            luminanceFit * 0.2 +
            saturation * 0.05 * rankBias;

        if (score > bestScore) {
            bestScore = score;
            bestColor = color;
        }
    }

    return bestColor;
}

export function selectRightColor(
    colors: Palette,
    position?: "first" | "second",
) {
    let finalColor = FALLBACK_COLOR;
    if (colors.vibrant && colors.vibrant !== "#000000") {
        finalColor = colors.vibrant;
    } else if (colors.darkVibrant && colors.darkVibrant !== "#000000") {
        finalColor = colors.darkVibrant;
    } else if (colors.muted && colors.muted !== "#000000") {
        finalColor = colors.muted;
    } else if (colors.dominant && colors.dominant !== "#000000") {
        finalColor = colors.dominant;
    } else {
        finalColor = FALLBACK_COLOR;
    }
    // console.log("Selected color:", finalColor);

    if (chroma(finalColor).luminance() < 0.5) {
        finalColor = chroma(finalColor).brighten(1.5).hex();
    }

    return finalColor;
}

export function selectRightColorDominant(
    colors: Palette,
    position?: "first" | "second",
) {
    let finalColor = FALLBACK_COLOR;
    if (colors.dominant && colors.dominant !== "#000000") {
        finalColor = colors.dominant;
    } else if (colors.vibrant && colors.vibrant !== "#000000") {
        finalColor = colors.vibrant;
    } else if (colors.darkVibrant && colors.darkVibrant !== "#000000") {
        finalColor = colors.darkVibrant;
    } else if (colors.muted && colors.muted !== "#000000") {
        finalColor = colors.muted;
    } else {
        finalColor = FALLBACK_COLOR;
    }
    // console.log("Selected color:", finalColor);

    // if (chroma(finalColor).luminance() < 0.5) {
    //     finalColor = chroma(finalColor).brighten(1.5).hex();
    // }

    return finalColor;
}

export function selectRightColorLastFm(
    colors: Palette,
    position?: "first" | "second",
) {
    let finalColor = FALLBACK_COLOR;
    if (colors.dominant && colors.dominant !== "#000000") {
        finalColor = colors.dominant;
    } else if (colors.vibrant && colors.vibrant !== "#000000") {
        finalColor = colors.vibrant;
    } else if (colors.darkVibrant && colors.darkVibrant !== "#000000") {
        finalColor = colors.darkVibrant;
    } else if (colors.muted && colors.muted !== "#000000") {
        finalColor = colors.muted;
    } else {
        finalColor = FALLBACK_COLOR;
    }

    if (chroma(finalColor).luminance() > 0.7) {
        finalColor = chroma(finalColor).luminance(0.2).hex();
    } else if (chroma(finalColor).luminance() < 0.3) {
        finalColor = chroma(finalColor).luminance(0.2).hex();
    }

    return chroma(finalColor).luminance(0.2).hex();
}

export function selectRightColorThief(colors: ColorPalette) {
    if (!colors || colors.length === 0) {
        return FALLBACK_COLOR;
    }

    let bestColor = colors[0];
    let bestScore = -Infinity;

    for (let index = 0; index < colors.length; index += 1) {
        const color = colors[index];

        if (!color || !isUsableColor(color.hex)) {
            continue;
        }

        const score = scoreBackgroundColor(color, index);

        if (score > bestScore) {
            bestScore = score;
            bestColor = color;
        }
    }

    if (!bestColor || !isUsableColor(bestColor.hex)) {
        return FALLBACK_COLOR;
    }

    return normalizeBackgroundColor(bestColor.hex);
}

export function selectBackgroundColor(
    colors: ColorThiefColorData[],
): BackgroundColorResult {
    if (!colors || colors.length === 0) {
        return { background: FALLBACK_COLOR, textColor: "#ffffff" };
    }

    const vibrant = colors.filter(
        (c) => c.hsl.s >= MIN_SATURATION_TO_TRUST_HUE,
    );
    const pool = vibrant.length > 0 ? vibrant : colors;

    let best: ColorThiefColorData | null = null;
    let bestScore = -Infinity;

    for (const color of pool) {
        const { s, l } = color.hsl;
        const dominanceScore = color.proportion;
        const lightnessScore = tentScore(l, TARGET_LIGHTNESS, LIGHTNESS_SPREAD);
        const saturationScore = Math.min(s / SATURATION_TARGET, 1);
        // console.log("SCORES:", dominanceScore, lightnessScore, saturationScore);

        const score =
            0.35 * dominanceScore +
            0.35 * lightnessScore +
            0.3 * saturationScore;

        if (score > bestScore) {
            bestScore = score;
            best = color;
        }
    }

    if (!best) {
        return { background: FALLBACK_COLOR, textColor: "#ffffff" };
    }

    const { s, l } = best.hsl;
    const adjustedL = Math.min(Math.max(l, MIN_LIGHTNESS), MAX_LIGHTNESS);

    // Se nem o melhor candidato bateu o mínimo de saturação confiável (imagem
    // genuinamente monocromática), devolve cinza puro em vez de inventar hue.
    if (s < MIN_SATURATION_TO_TRUST_HUE) {
        const gray = Math.round(adjustedL * 255);
        return {
            background: rgbToHex(gray, gray, gray),
            textColor: adjustedL > 0.5 ? "#000000" : "#ffffff",
        };
    }

    const adjustedS =
        s < SATURATION_TARGET ? Math.min(s * 1.4, SATURATION_TARGET) : s;
    const [r, g, b] = hslToRgb(best.hsl.h, adjustedS, adjustedL);

    return {
        background: rgbToHex(r, g, b),
        textColor: adjustedL > 0.5 ? "#000000" : "#ffffff",
    };
}

export function selectBackgroundGradient(
    colors: ColorThiefColorData[],
): GradientBackgroundColorResult {
    if (!colors || colors.length === 0) {
        return {
            background: FALLBACK_COLOR,
            accent: FALLBACK_COLOR,
            palette: buildPaletteFromPair(FALLBACK_COLOR, FALLBACK_COLOR),
            textColor: "#ffffff",
        };
    }

    const vibrant = colors.filter(
        (c) => c.hsl.s >= MIN_SATURATION_TO_TRUST_HUE,
    );
    const pool = vibrant.length > 0 ? vibrant : colors;
    const background = getBestColorCandidate(pool);

    if (!background) {
        return {
            background: FALLBACK_COLOR,
            accent: FALLBACK_COLOR,
            palette: buildPaletteFromPair(FALLBACK_COLOR, FALLBACK_COLOR),
            textColor: "#ffffff",
        };
    }

    let accent: ColorThiefColorData | null = null;
    let accentScore = -Infinity;

    for (let index = 0; index < pool.length; index += 1) {
        const candidate = pool[index];

        if (
            !candidate ||
            !isUsableColor(candidate.hex) ||
            candidate.hex === background.hex
        ) {
            continue;
        }

        const score = scoreGradientPair(background, candidate, index);

        if (score > accentScore) {
            accentScore = score;
            accent = candidate;
        }
    }

    const backgroundHex = normalizeBackgroundColor(background.hex);
    const accentHex = accent
        ? normalizeBackgroundColor(accent.hex)
        : backgroundHex;
    const palette = buildPaletteFromPair(backgroundHex, accentHex);
    console.log("PALETA:", backgroundHex, accentHex,palette);

    return {
        background: backgroundHex,
        accent: accentHex,
        palette,
        textColor:
            chroma(backgroundHex).luminance() > 0.5 ? "#000000" : "#ffffff",
    };
}

function findBestBackgroundCandidate(colors: ColorPalette) {
    let bestColor: ColorPalette[number] | null = null;
    let bestScore = -Infinity;

    for (let index = 0; index < colors.length; index += 1) {
        const color = colors[index];
        if (!color || !isUsableColor(color.hex)) continue;

        const score = scoreBackgroundColor(color, index);
        if (score > bestScore) {
            bestScore = score;
            bestColor = color;
        }
    }

    return bestColor;
}


function pickGradientAccent(
    backgroundEntry: ColorPalette[number],
    colors: ColorPalette,
): ColorPalette[number] | null {
    let best: ColorPalette[number] | null = null;
    let bestScore = -Infinity;

    for (let index = 0; index < colors.length; index += 1) {
        const color = colors[index];
        if (!color || !isUsableColor(color.hex)) continue;
        if (color === backgroundEntry) continue; // mesma entrada da paleta, não a mesma cor final

        // compara contra o hex CRU do background, não o normalizado
        if (chroma.deltaE(backgroundEntry.hex, color.hex) < MIN_DELTA_E_FROM_BASE) continue;

        const score = scoreGradientPair(backgroundEntry, color, index);
        if (score > bestScore) {
            bestScore = score;
            best = color;
        }
    }

    return bestScore >= MIN_ACCEPTABLE_GRADIENT_SCORE ? best : null;
}

function synthesizeAccent(background: string): string {
    const [, s] = chroma(background).hsl();
    // se o fundo já é bem dessaturado (fotos escuras/neutras), garante um mínimo
    // de saturação pro accent não virar só "um cinza mais escuro"
    const baseSaturation = Number.isNaN(s) ? 0 : s;
    const targetSaturation = Math.max(baseSaturation, 0.18);

    return chroma(background)
        .set("hsl.h", `+${SECONDARY_HUE_TARGET}`)
        .set("hsl.s", targetSaturation)
        .set("hsl.l", SECONDARY_LIGHTNESS_TARGET)
        .hex();
}

export function selectGradientBackgroundColor(
    colors: ColorPalette,
): GradientBackgroundColorResult {
    if (!colors || colors.length === 0) {
        return {
            background: FALLBACK_COLOR,
            accent: FALLBACK_COLOR,
            palette: buildPaletteFromPair(FALLBACK_COLOR, FALLBACK_COLOR),
            textColor: "#ffffff",
        };
    }

    const backgroundEntry = findBestBackgroundCandidate(colors);
    if (!backgroundEntry) {
        return {
            background: FALLBACK_COLOR,
            accent: FALLBACK_COLOR,
            palette: buildPaletteFromPair(FALLBACK_COLOR, FALLBACK_COLOR),
            textColor: "#ffffff",
        };
    }

    const background = normalizeBackgroundColor(backgroundEntry.hex);
    const textColor =
        chroma.contrast(background, "#ffffff") >= MIN_WHITE_CONTRAST
            ? "#ffffff"
            : "#000000";

    const accentEntry = pickGradientAccent(backgroundEntry, colors);
    let accent = accentEntry
        ? normalizeBackgroundColor(accentEntry.hex)
        : synthesizeAccent(background);

    // guarda final: se por acaso a normalização ainda colapsar os dois tons, sintetiza
    if (chroma.deltaE(background, accent) < MIN_DELTA_E_FROM_BASE) {
        accent = synthesizeAccent(background);
    }

    const palette = chroma
        .scale([background, accent])
        .mode("lab")
        .colors(3) as [string, string, string];

    return { background, textColor, accent, palette };
}