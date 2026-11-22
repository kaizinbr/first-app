import { skipToken, useQuery } from "@tanstack/react-query";
import { getPalette } from "expo-color-thief-native";
import { Palette } from "@/lib/types";

export default function usePalette(
    imageUrl?: string,
    options?: {
        quality?: number;
        region?: { x: number; y: number; width: number; height: number };
    },
) {
    return useQuery({
        queryKey: ["palette", imageUrl],
        queryFn: imageUrl
            ? async () =>
                  await getPalette(imageUrl, {
                      quality: options?.quality || 10,
                      region: options?.region || undefined,
                  })
            : skipToken,
        staleTime: Infinity,
    });
}
