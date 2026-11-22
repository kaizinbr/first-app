import {
    useQuery,
    useInfiniteQuery,
    useQueryClient,
    InfiniteData,
} from "@tanstack/react-query";
import api from "@/lib/api";

import { ReviewWithAlbum } from "@/lib/types";

export function enxugarReview(review: any) {
    if (!review.Profile) return review;
    const { pushToken, ...perfil } = review.Profile;
    return { ...review, Profile: perfil };
}

type ReviewsPage = {
    next: number | null;
    page: number;
    reviews: ReviewWithAlbum[];
    totalReviews: number;
};

export function useReviews({
    endpoint,
    sort,
}: {
    endpoint: string;
    sort?: "asc" | "desc";
}) {
    const queryClient = useQueryClient();
    const queryKey = ["reviews", endpoint, sort];

    const query = useInfiniteQuery({
        queryKey,
        queryFn: async ({ pageParam }) => {
            const { data } = await api.get<ReviewsPage>(endpoint, {
                params: { p: pageParam, sort },
            });
            return data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.next ?? undefined,
        staleTime: 1000 * 60 * 60, // 1h
    });

    const refresh = async () => {
        queryClient.setQueryData<InfiniteData<ReviewsPage, number>>(
            queryKey,
            (old) =>
                old
                    ? {
                          pages: old.pages.slice(0, 1),
                          pageParams: old.pageParams.slice(0, 1),
                      }
                    : old,
        );
        await query.refetch();
    };

    return { ...query, refresh };
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

            if (
                __DEV__ &&
                review.album?.tracks?.items?.[0]?.available_markets
            ) {
                console.warn(
                    "[review] available_markets ainda chegou: confira se a API repassa ?market=BR ao Spotify",
                );
            }

            return enxugarReview(review);
        },
        staleTime: 1000 * 60,
    });
}
