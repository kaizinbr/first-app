import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
    LastfmGenre,
    LastfmRange,
    LastfmTopResponse,
    LastfmTopType,
} from "@/lib/lastfm-types";

function rangeParams(range: LastfmRange) {
    return "period" in range
        ? { period: range.period }
        : { from: range.from, to: range.to };
}

/**
 * Períodos prontos mudam a cada scrobble: 10 min. Intervalo livre que já terminou há mais de
 * 1 dia não muda mais: 1 hora (mesmo assim o cache aparece na hora e é revalidado em segundo plano).
 */
function rangeStaleTime(range: LastfmRange) {
    const closed = "from" in range && range.to < Date.now() / 1000 - 86_400;
    return closed ? 1000 * 60 * 60 : 1000 * 60 * 10;
}

/**
 * `placeholderData: keepPreviousData` mantém a lista anterior na tela (com `isPlaceholderData`
 * verdadeiro) enquanto o período novo carrega, em vez de piscar vazio a cada chip.
 */
export function useLastfmTop(
    username: string,
    type: LastfmTopType,
    range: LastfmRange,
) {
    return useQuery({
        queryKey: ["lastfm", username, "top", type, range],
        queryFn: async () => {
            const { data } = await api.get<LastfmTopResponse>(
                `/lastfm/${username}/top`,
                { params: { type, ...rangeParams(range) } },
            );
            return data;
        },
        staleTime: rangeStaleTime(range),
        placeholderData: keepPreviousData,
        enabled: !!username,
    });
}

export function useLastfmGenres(username: string, range: LastfmRange) {
    return useQuery({
        queryKey: ["lastfm", username, "genres", range],
        queryFn: async () => {
            const { data } = await api.get<{ genres: LastfmGenre[] }>(
                `/lastfm/${username}/genres`,
                { params: rangeParams(range) },
            );
            return data.genres;
        },
        staleTime: rangeStaleTime(range),
        placeholderData: keepPreviousData,
        enabled: !!username,
    });
}

export function useLastfmSummary(username: string, range: LastfmRange) {
    return useQuery({
        queryKey: ["lastfm", username, "summary", range],
        queryFn: async () => {
            const { data } = await api.get<{ scrobbles: number }>(
                `/lastfm/${username}/summary`,
                { params: rangeParams(range) },
            );
            return data.scrobbles;
        },
        staleTime: rangeStaleTime(range),
        placeholderData: keepPreviousData,
        enabled: !!username,
    });
}

/**
 * Capa de música ou artista (o top só traz a capa dos álbuns). Não depende do período nem da
 * pessoa e quase nunca muda: nunca fica velha e fica 30 dias no cache.
 */
export function useLastfmCover(
    kind: "track" | "artist",
    artist: string,
    track: string | undefined,
    enabled: boolean,
) {
    return useQuery({
        queryKey: ["lastfm", "cover", kind, artist, track],
        queryFn: async () => {
            const { data } = await api.get<{ imageUrl: string | null }>(
                "/lastfm-cover",
                { params: { type: kind, artist, track } },
            );
            return data.imageUrl;
        },
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60 * 24 * 30,
        enabled: enabled && artist !== "",
    });
}
