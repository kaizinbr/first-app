// hooks/useLike.ts
import { useState, useCallback, useEffect } from "react";
import { apiAuth, apiAuthPost } from "@/lib/api";

interface UseLikeProps {
    ratingId: string;
    initialCount: number;
}

export function useLike({ ratingId, initialCount }: UseLikeProps) {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        async function fetchLikeStatus() {
            try {
                const response = await apiAuth(`/reviews/${ratingId}/like`);
                console.log("Like status response:", response);
                setLiked(response.liked);
                setAuthenticated(response.authenticated);
            } catch (error) {
                console.error("Error fetching like status:", error);
            }
        }
        fetchLikeStatus();
    }, [ratingId]);

    const toggle = useCallback(async () => {
        console.log("Toggling like for ratingId:", authenticated);
        if (loading || !authenticated) return;

        const wasLiked = liked;
        setLiked(!wasLiked);
        setCount((prev) => (wasLiked ? prev - 1 : prev + 1));

        try {
            setLoading(true);
            const response = await apiAuthPost(`/reviews/${ratingId}/like`);
            if (response.liked !== !wasLiked) {
                setLiked(response.liked);
            }
        } catch {
            setLiked(wasLiked);
            setCount((prev) => (wasLiked ? prev + 1 : prev - 1));
        } finally {
            setLoading(false);
        }
    }, [liked, loading, authenticated, ratingId]);

    return { liked, count, toggle, loading, authenticated };
}
