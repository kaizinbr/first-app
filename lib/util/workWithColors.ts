import chroma from "chroma-js";
import { Palette } from "@/lib/types";

export function lightenColor(color: string, amount: number) {
    return chroma(color).brighten(amount).hex();
}

export function darkenColor(color: string, amount: number) {
    if (chroma(color).luminance() > 0.5) {
        color = chroma(color).darken(1.5).hex();
    }

    // console.log("Darkening color:", color, "by amount:", amount);

    return chroma(color).darken(amount).hex();
}

export function getHeaderColor(colors: Palette) {
    let finalColor = "#2458aa";
    if (colors.dominant && chroma(colors.dominant).luminance() > 0.2) {
        finalColor = colors.dominant;
    } else if (colors.darkVibrant && chroma(colors.darkVibrant).luminance() > 0.2) {
        finalColor = colors.darkVibrant;
    } else if (colors.vibrant && chroma(colors.vibrant).luminance() > 0.2) {
        finalColor = colors.vibrant;
    } else  if (colors.muted && chroma(colors.muted).luminance() > 0.1) {
        finalColor = colors.muted;
    } else {
        finalColor = "#2458aa";
    }
    // console.log(chroma(colors.muted).luminance());

    if (chroma(finalColor).luminance() > 0.4) {
        finalColor = chroma(finalColor).darken(1.5).hex();
    }


    // console.log("Darkening color:", finalColor, "by amount: 0.4");

    return chroma(finalColor).darken(0.4).hex();
}


export function getBannerColor(colors: Palette | any) {
    let finalColor = colors.dominant || colors.vibrant || "#161718";

    // console.log("todas as cores:", colors);

    if (colors.vibrant && colors.vibrant !== "#000000") {
        finalColor = colors.vibrant;
    } else if (colors.darkVibrant && colors.darkVibrant !== "#000000") {
        finalColor = colors.darkVibrant;
    } else if (colors.muted && colors.muted !== "#000000") {
        finalColor = colors.muted;
    } else  if (colors.dominant && colors.dominant !== "#000000") {
        finalColor = colors.dominant;
    }

    // console.log("Color before adjustments:", finalColor);

    if (chroma(finalColor).luminance() > 0.6) {
        finalColor = chroma(finalColor).darken(1).hex();
    }    
    if (chroma(finalColor).luminance() < 0.02) {
        finalColor = chroma(finalColor).brighten(1).hex();
    }

    // console.log("Final color:", finalColor);

    return finalColor;
}

export function getBannerColors(colors: Palette | any) {
    let finalColor1 = colors.dominant || colors.vibrant || "#161718";
    let finalColor2 = colors.darkVibrant || colors.muted || "#161718";


    if (colors.vibrant && colors.vibrant !== "#000000") {
        finalColor1 = colors.vibrant;
    } else if (colors.darkVibrant && colors.darkVibrant !== "#000000") {
        finalColor1 = colors.darkVibrant;
    } else if (colors.muted && colors.muted !== "#000000") {
        finalColor1 = colors.muted;
    } else  if (colors.dominant && colors.dominant !== "#000000") {
        finalColor1 = colors.dominant;
    } else {
        finalColor1 = "#161718";
    }

    if (colors.darkVibrant && colors.darkVibrant !== "#000000") {
        finalColor2 = colors.darkVibrant;
    } else if (colors.muted && colors.muted !== "#000000") {
        finalColor2 = colors.muted;
    } else if (colors.vibrant && colors.vibrant !== "#000000") {
        finalColor2 = colors.vibrant;
    } else  if (colors.dominant && colors.dominant !== "#000000") {
        finalColor2 = colors.dominant;
    } else {
        finalColor2 = "#161718";
    }

    if (chroma(finalColor1).luminance() > 0.6) {
        finalColor1 = chroma(finalColor1).darken(1).hex();
    }
    if (chroma(finalColor1).luminance() < 0.02) {
        finalColor1 = chroma(finalColor1).brighten(1).hex();
    }

    if (chroma(finalColor2).luminance() > 0.6) {
        finalColor2 = chroma(finalColor2).darken(1).hex();
    }
    if (chroma(finalColor2).luminance() < 0.02) {
        finalColor2 = chroma(finalColor2).brighten(1).hex();
    }

    finalColor2 = chroma(finalColor2).darken(1).hex();

    return [finalColor1, finalColor2];
}