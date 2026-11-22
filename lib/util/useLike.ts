// hooks/useLike.ts
import api from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

export function useLike({ id, initialCount, type, initialLiked }: {
    id: string;
    initialCount: number;
    type: "review" | "comment";
    initialLiked?: boolean;
}) {
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);

    const toggle = useCallback(async () => {
        console.log("Toggling like for id:", id, "Type:", type, "Current liked state:", liked);
        if (loading) return;

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
    }, [liked, loading, id, type]);

    if (count < 0) {
        setCount(0);
    }

    return { liked, count, toggle, loading };
}
