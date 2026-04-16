import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

interface SavedLyrics {
    trackId: string;
    trackName: string;
    artistNames: string;
    albumArt: string;
    lines: { startTimeMs: string; words: string }[];
    selectedIndexes: number[];
    color: string;
}

export default function LyricsCard({
    saved,
    setLyrics,
}: {
    saved: SavedLyrics;
    setLyrics?: React.Dispatch<React.SetStateAction<any>>;
}) {
    const selectedLines = saved.selectedIndexes.map(
        (i) => saved.lines[i].words,
    );

    return (
        <View style={[styles.card, { backgroundColor: saved.color }]}>
            {/* Header com info da música */}
            {setLyrics && (
                <Pressable
                    style={styles.closeBtn}
                    onPress={() => setLyrics(null)}
                >
                    <Ionicons name="close-sharp" size={24} color="#eee" />
                </Pressable>
            )}
            <View style={styles.header}>
                <Image
                    source={{ uri: saved.albumArt }}
                    style={styles.albumArt}
                />
                <View style={{ flex: 1 }}>
                    <Text style={styles.trackName} numberOfLines={1}>
                        {saved.trackName}
                    </Text>
                    <Text style={styles.artistName} numberOfLines={1}>
                        {saved.artistNames}
                    </Text>
                </View>
            </View>

            {/* Linhas selecionadas */}
            <View style={styles.linesWrapper}>
                {selectedLines.map((words, index) => (
                    <View key={index}>
                        <Text style={styles.pillText}>{words}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        // backgroundColor: "#1e1e1e",
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    albumArt: {
        width: 36,
        height: 36,
        borderRadius: 4,
    },
    trackName: {
        color: "#eee",
        fontSize: 13,
        fontFamily: "Walsheim",
        fontWeight: "700",
    },
    artistName: {
        color: "#d5d6d7",
        fontSize: 12,
        fontFamily: "Walsheim",
    },
    linesWrapper: {
        gap: 6,
    },
    pillText: {
        color: "#eee",
        fontSize: 16,
        fontFamily: "Walsheim",
        fontWeight: "700",
        lineHeight: 20,
    },
    closeBtn: {
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 10,
        padding: 4,
    },
});
