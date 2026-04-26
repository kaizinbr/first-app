import { View, Text, StyleSheet, Pressable } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TextDefault from "@/components/core/text-core";

import { Track } from "@/lib/types";

export default function TrackItem({
    track,
    onPress,
}: {
    track: Track;
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
                <TextDefault style={styles.trackNumber}>{track.track_number}</TextDefault>
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

            <View style={styles.actionColumn}>
                <TextDefault style={styles.trackDuration}>
                    {Math.floor(track.duration_ms / 60000)}:
                    {Math.floor((track.duration_ms % 60000) / 1000)
                        .toFixed(0)
                        .padStart(2, "0")}
                </TextDefault>
                {/* <Pressable style={{ marginLeft: 16 }}>
                    <Icon type="more-vertical" color="#777" size={20} />
                </Pressable> */}
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
        alignItems: "center",
    },
    trackDuration: {
        color: "#777",
        fontSize: 14,
    },
});
