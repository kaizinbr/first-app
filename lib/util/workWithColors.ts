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


export function getBannerColor(color: string) {
    let finalColor = color;
    
    // console.log(chroma(finalColor).luminance());

    if (chroma(finalColor).luminance() > 0.6) {
        finalColor = chroma(finalColor).darken(1).hex();
    }    
    if (chroma(finalColor).luminance() < 0.02) {
        finalColor = chroma(finalColor).brighten(1).hex();
    }

    // console.log("Darkening color:", finalColor, "by amount: 0.4");

    return finalColor;
}
