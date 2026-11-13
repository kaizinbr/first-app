import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function enxugarReview(review: any) {
    if (!review.Profile) return review;
    const { pushToken, ...perfil } = review.Profile;
    return { ...review, Profile: perfil };
}

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