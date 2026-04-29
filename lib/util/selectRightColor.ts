import chroma from 'chroma-js';
import { Palette } from "@/lib/types";

export function selectRightColor(colors: Palette, position?: "first" | "second") {
    let finalColor = "#2458aa";
    if (colors.vibrant && colors.vibrant !== "#000000") {
        finalColor = colors.vibrant;
    } else if (colors.darkVibrant && colors.darkVibrant !== "#000000") {
        finalColor = colors.darkVibrant;
    } else if (colors.muted && colors.muted !== "#000000") {
        finalColor = colors.muted;
    } else  if (colors.dominant && colors.dominant !== "#000000") {
        finalColor = colors.dominant;
    } else {
        finalColor = "#2458aa";
    }
    // console.log("Selected color:", finalColor);

    if (chroma(finalColor).luminance() < 0.5) {
        finalColor = chroma(finalColor).brighten(1.5).hex();
    }


    return finalColor;

}

export function selectRightColorDominant(colors: Palette, position?: "first" | "second") {
    let finalColor = "#2458aa";
    if (colors.dominant && colors.dominant !== "#000000") {
        finalColor = colors.dominant;
    } else if (colors.vibrant && colors.vibrant !== "#000000") {
        finalColor = colors.vibrant;
    } else if (colors.darkVibrant && colors.darkVibrant !== "#000000") {
        finalColor = colors.darkVibrant;
    } else if (colors.muted && colors.muted !== "#000000") {
        finalColor = colors.muted;
    } else  {
        finalColor = "#2458aa";
    }
    // console.log("Selected color:", finalColor);

    // if (chroma(finalColor).luminance() < 0.5) {
    //     finalColor = chroma(finalColor).brighten(1.5).hex();
    // }


    return finalColor;

}