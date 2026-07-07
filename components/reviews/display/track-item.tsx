import { View, Text, StyleSheet, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import TextDefault from "@/components/core/text-core";
import { Track, Rating } from "@/lib/types";
import { Stars, ChatRoundLine  } from "@solar-icons/react-native/Bold";

export default function TrackItem({
    track,
    onPress,
}: {
    track: Track & {
        value?: number | null;
        comment?: string | null;
        favorite?: boolean | null;
        skip?: boolean | null;
    };
    onPress: () => void;
}) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.trackRow,
                pressed && { opacity: 0.5 },
            ]}
            onPress={onPress}
        >
            <View style={styles.numberColumn}>
                <TextDefault style={styles.trackNumber}>
                    {track.track_number}
                </TextDefault>
            </View>

            <View style={styles.infoColumn}>
                <View style={styles.titleLine}>
                    {track.explicit && (
                        <MaterialIcons
                            name="explicit"
                            size={16}
                            color="#777"
                            style={{ marginRight: 4 }}
                        />
                    )}
                    <TextDefault style={styles.trackTitle} numberOfLines={1}>
                        {track.name}
                    </TextDefault>
                </View>
                <TextDefault style={styles.trackArtist} numberOfLines={1}>
                    {track.artists.map((artist) => artist.name).join(", ")}
                </TextDefault>
            </View>
            {track.comment ? (
                <View style={styles.actionColumn}>
                    <ChatRoundLine size={24} color="#8065ef" />
                </View>
            ) : null}
            {track.favorite ? (
                <View style={styles.actionColumn}>
                        <Stars size={24} color="#8065ef" />
                </View>
            ) : null}
            <View style={styles.actionColumn}>
                <TextDefault style={styles.trackDuration}>
                    {track.skip === true
                        ? "N/A"
                        : track.value !== null && track.value !== undefined
                          ? track.value
                          : "N/A"}
                </TextDefault>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    trackRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12, // Espaçamento entre as linhas
        width: "100%",
    },
    numberColumn: {
        width: 40, // Largura fixa para manter todos os números alinhados
        alignItems: "flex-start",
    },
    trackNumber: {
        color: "#777", // Cinza como no Spotify
        fontSize: 12,
        fontWeight: "bold",
    },
    infoColumn: {
        flex: 1, // Empurra a duração lá pro final da tela
        justifyContent: "center",
        paddingRight: 16,
        // backgroundColor: "rgba(255,255,255,0.05)",
    },
    titleLine: {
        flexDirection: "row",
        alignItems: "center",
    },
    trackTitle: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        alignItems: "center",
    },
    trackArtist: {
        color: "#aaa",
        fontSize: 12,
        marginTop: 2,
    },
    actionColumn: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        width: 40,
        // backgroundColor: "rgba(255,255,255,0.05)",
    },
    trackDuration: {
        color: "#777",
        fontSize: 14,
    },
});
