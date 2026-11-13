import { skipToken, useQuery } from "@tanstack/react-query";
import { getPalette } from "expo-color-thief-native";
import { Palette } from "@/lib/types";


export default function usePalette(imageUrl?: string) {
    return useQuery({
        queryKey: ["palette", imageUrl],
        queryFn: imageUrl
            ? async () => await getPalette(imageUrl, { quality: 10 })
            : skipToken,
        staleTime: Infinity,
    });
}