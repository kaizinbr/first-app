import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useUser(username: string) {
    return useQuery({
        queryKey: ["user", username],
        queryFn: async ({ signal }) => {
            const { data } = await api.get(`/users/${username}`, {
                signal,
            });

            const user = data;
            if (!user) return null;

            return user;
        },
        staleTime: 1 * 60 * 60 * 1000, // 1h
    });
}

export function useUserWishlist(username: string) {
    return useQuery({
        queryKey: ["user", username, "wishlist"],
        queryFn: async ({ signal }) => {
            const { data } = await api.get(`/users/${username}/wishlist`, {
                signal,
            });

            const userWishlist = data;
            if (!userWishlist) return null;

            return userWishlist;
        },
    });
}

export function useUserFollowings(username: string) {
    return useQuery({
        queryKey: ["user", username, "followings"],
        queryFn: async ({ signal }) => {
            const { data } = await api.get(`/users/${username}/followings`, {
                signal,
            });
            const userFollowings = data;
            if (!userFollowings) return null;
            return userFollowings;
        },
    });
}

export function useUserFollowers(username: string) {
    return useQuery({
        queryKey: ["user", username, "followers"],  
        queryFn: async ({ signal }) => {
            const { data } = await api.get(`/users/${username}/followers`, {
                signal,
            });
            const userFollowers = data;
            if (!userFollowers) return null;
            return userFollowers;
        }
    });
}