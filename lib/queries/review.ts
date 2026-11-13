import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function enxugarReview(review: any) {
    if (!review.Profile) return review;
    const { pushToken, ...perfil } = review.Profile;
    return { ...review, Profile: perfil };
}

export function useReview(id: string) {
    return useQuery({
        queryKey: ["review", id],
        queryFn: async ({ signal }) => {
            const { data } = await api.get(`/reviews/${id}`, {
                params: { market: "BR" },
                signal,
            });

            const review = data[0];
            if (!review) return null;

            if (__DEV__ && review.album?.tracks?.items?.[0]?.available_markets) {
                console.warn(
                    "[review] available_markets ainda chegou: confira se a API repassa ?market=BR ao Spotify",
                );
            }

            return enxugarReview(review);
        },
        staleTime: 1000 * 60,
    });
}