import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useBanner() {
    return useQuery({
        queryKey: ["banner", "banner_data"],
        queryFn: async ({ signal }) => {
            const { data } = await api.get(`/banner`, { signal });

            const banner = data;
            if (!banner) return null;

            return banner;
        },
        staleTime: 300000,
    });
}