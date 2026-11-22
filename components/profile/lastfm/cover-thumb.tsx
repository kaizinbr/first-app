import { View } from "react-native";
import { Image } from "expo-image";
import TextDefault from "@/components/core/text-core";
import { useLastfmCover } from "@/lib/queries/lastfm-stats";
import type { LastfmTopItem, LastfmTopType } from "@/lib/lastfm-types";

/**
 * Álbuns já vêm com capa. Músicas e artistas buscam a capa depois que a lista aparece
 * (e ela fica no cache). Sem nenhuma capa, mostra a inicial.
 */
export default function CoverThumb({
    type,
    item,
}: {
    type: LastfmTopType;
    item: LastfmTopItem;
}) {
    const { data: fetched } = useLastfmCover(
        type === "tracks" ? "track" : "artist",
        type === "tracks" ? (item.artist ?? "") : item.name,
        type === "tracks" ? item.name : undefined,
        type !== "albums" && !item.imageUrl,
    );
    const uri = item.imageUrl ?? fetched;
    const radius = type === "artists" ? 20 : 6;

    return uri ? (
        <Image
            source={{ uri }}
            contentFit="cover"
            transition={200}
            style={{ width: 40, height: 40, borderRadius: radius }}
        />
    ) : (
        <View
            style={{
                width: 40,
                height: 40,
                borderRadius: radius,
                backgroundColor: "#2a2b2c",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <TextDefault style={{ color: "#989898", fontSize: 16, fontWeight: "bold" }}>
                {item.name.charAt(0).toUpperCase()}
            </TextDefault>
        </View>
    );
}
