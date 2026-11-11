// hooks/useLike.ts
import api from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

interface UseLikeProps {
    id: string;
    initialCount: number;
    type: "review" | "comment";
}

export function useLike({ id, initialCount, type }: UseLikeProps) {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        async function fetchLikeStatus() {
            try {
                const response = await api.get(`/${type}s/${id}/like`);
                // console.log("Like status response:", response);
                setLiked(response.data.liked);
                setAuthenticated(response.data.authenticated);
            } catch (error) {
                console.error("Error fetching like status:", error);
            }
        }
        fetchLikeStatus();
    }, [id]);

    const toggle = useCallback(async () => {
        console.log("Toggling like for id:", authenticated);
        if (loading || !authenticated) return;

        const wasLiked = liked;
        setLiked(!wasLiked);
        setCount((prev) => (wasLiked ? prev - 1 : prev + 1));

        try {
            setLoading(true);
            const response = await api.post(`/${type}s/${id}/like`);
            if (response.data.liked !== !wasLiked) {
                setLiked(response.data.liked);
            }
        } catch {
            setLiked(wasLiked);
            setCount((prev) => (wasLiked ? prev + 1 : prev - 1));
        } finally {
            setLoading(false);
        }
    }, [liked, loading, authenticated, id, type]);

    if (count < 0) {
        setCount(0);
    }

    return { liked, count, toggle, loading, authenticated };
}
