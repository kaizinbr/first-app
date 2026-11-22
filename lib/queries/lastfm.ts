import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useLastfm(username: string) {
    return useQuery({
        queryKey: ["lastfm", username, "getinfo"],
        queryFn: async ({ signal }) => {
            const { data } = await api.get(`/lastfm/${username}`, {
                signal,
            });
            if (!data.user) return null;
            return data.user;
        },
        staleTime: 24 * 60 * 60 * 1000, // 24h
    });
}