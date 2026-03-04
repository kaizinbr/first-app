
import { Palette } from "@/lib/types";

export function selectRightColor(colors: Palette) {
    if (colors.darkVibrant && colors.darkVibrant !== "#000000") {
        return colors.darkVibrant;
    } else if (colors.muted && colors.muted !== "#000000") {
        return colors.muted;
    } else if (colors.vibrant && colors.vibrant !== "#000000") {
        return colors.vibrant;
    } else if (colors.dominant && colors.dominant !== "#000000") {
        return colors.dominant;
    } else {
        return "#282b30";
    }
}