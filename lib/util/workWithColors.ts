import chroma from 'chroma-js';

export function lightenColor(color: string, amount: number) {
    return chroma(color).brighten(amount).hex();
}

export function darkenColor(color: string, amount: number) {
    return chroma(color).darken(amount).hex();
}