import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useArtist(id: string) {
    return useQuery({
        queryKey: ["artist", id],
        queryFn: async ({ signal }) => {
            const { data } = await api.get(`/artists/${id}`, {
                params: { market: "BR" },
                signal,
            });

            const artist = data;
            if (!artist) return null;

            return artist;
        },
        staleTime: 24 * 60 * 60 * 1000, // 24h
    });
}

export function useArtistAlbuns(id: string, offset: number = 0, limit: number = 50) {
    return useQuery({
        queryKey: ["artist", id, "albuns"],
        queryFn: async ({ signal }) => {
            const { data } = await api.get(`/artists/${id}/albuns`, {
                params: { market: "BR", offset, limit },
                signal,
            });

            const artistAlbuns = data;
            if (!artistAlbuns) return null;

            return artistAlbuns;
        },
        staleTime: 1 * 60 * 60 * 1000, // 1h
    });
}

export function useArtistAlbunsRelative(id: string, offset: number = 0, limit: number = 50) {
    return useQuery({
        queryKey: ["artist", id, "albuns-relative"],
        queryFn: async ({ signal }) => {
            const { data } = await api.get(`/artists/${id}/albuns`, {
                params: { market: "BR", offset, limit },
                signal,
            });

            const artistAlbuns = data;
            if (!artistAlbuns) return null;

            return artistAlbuns;
        },
        staleTime: 1 * 60 * 60 * 1000, // 1h
    });
}