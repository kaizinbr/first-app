import {
    Text,
    Image,
    View,
    StyleSheet,
    ScrollView,
    Platform,
    Pressable,
    StatusBar as RNStatusBar,
    Dimensions,
} from "react-native";
import TextDefault from "@/components/core/text-core";
import { Album } from "@/lib/types";
import { useRouter } from "expo-router";

export default function AlbumData({ data }: any) {
    const router = useRouter();
    return (
        <View style={[styles.container]}>
            <TextDefault style={styles.albumType}>
                {(() => {
                    switch (data.type) {
                        case "album":
                            return "Álbum";
                        case "single":
                            return "Single/EP";
                        case "compilation":
                            return "Compilação";
                        default:
                            return "Outro";
                    }
                })()}{" "}
                • {new Date(data.release_date).getFullYear()} •{" "}
                {data.total_tracks} faixa{data.total_tracks > 1 ? "s" : ""}
            </TextDefault>
            <TextDefault style={styles.albumTitle}>{data.name}</TextDefault>
            <Pressable
                onPress={() => router.push(`/artist/${data.artists[0].id}`)}
            >
                <TextDefault style={styles.albumArtist}>
                    {data.artists.map((artist: any) => artist.name).join(", ")}
                </TextDefault>
            </Pressable>
        </View>
    );
}

export function AlbumExtraData({ data }: { data: Album }) {
    const releaseDate = new Date(data.release_date + "T00:00:00");
    const totalTracks = data.tracks.items.length;
    const totalDurationMs = data.tracks.items.reduce(
        (sum, track) => sum + track.duration_ms,
        0,
    );
    const totalDurationHours = Math.floor(totalDurationMs / 3600000);
    const totalDurationMin = Math.floor((totalDurationMs % 3600000) / 60000)
        .toString()
        .padStart(2, "0");

    return (
        <View style={[styles.container]}>
            <TextDefault style={styles.extraInfo}>
                Lançado em{" "}
                {new Date(data.release_date + "T00:00:00").toLocaleDateString(
                    "pt-BR",
                )}
            </TextDefault>
            <TextDefault style={styles.extraInfo}>
                {totalTracks} faixa{totalTracks > 1 ? "s" : ""} • Duração total:{" "}
                {totalDurationHours > 0 ? `${totalDurationHours}h` : ""}
                {totalDurationMin}m
            </TextDefault>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: "transparent",
    },
    albumArt: {
        width: 200,
        height: 200,
        borderRadius: 12,
        marginTop: 100,
        marginBottom: 32,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    albumType: { color: "#c4c4c4", fontSize: 12, fontWeight: "500" },
    albumTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "800",
        marginTop: 4,
    },
    albumArtist: {
        color: "#ccc",
        fontSize: 16,
        fontWeight: "500",
        marginTop: 4,
    },
    moreData: {
        marginTop: 24,
        padding: 16,
        backgroundColor: "#1e1e1e",
    },
    extraInfo: {
        color: "#777",
        fontSize: 14,
    },
});
