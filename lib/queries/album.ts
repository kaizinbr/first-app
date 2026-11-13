import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function enxugarReview(review: any) {
    if (!review.Profile) return review;
    const { pushToken, ...perfil } = review.Profile;
    return { ...review, Profile: perfil };
}

export function useAlbum(id: string) {
    return useQuery({
        queryKey: ["album", id],
        queryFn: async ({ signal }) => {
            const { data } = await api.get(`/albuns/${id}`, {
                params: { market: "BR" },
                signal,
            });

            const album = data;
            if (!album) return null;

            return album;
        },
        staleTime: 24 * 60 * 60 * 1000, // 24h
    });
}