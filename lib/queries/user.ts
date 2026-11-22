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

// export function useuserColor(username) {
//     return useQuery({
//         queryKey: ["artist", id, "albuns"],
//         queryFn: async ({ signal }) => {
//             const { data } = await api.get(`/artists/${id}/albuns`, {
//                 params: { market: "BR", offset, limit },
//                 signal,
//             });

//             const artistAlbuns = data;
//             if (!artistAlbuns) return null;

//             return artistAlbuns;
//         },
//         staleTime: 1 * 60 * 60 * 1000, // 1h
//     });
// }

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