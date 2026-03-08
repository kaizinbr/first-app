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
import Animated, {
    useAnimatedStyle,
    useAnimatedScrollHandler,
    useSharedValue,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import { Track } from "@/lib/types";
import TrackItem from "@/components/albuns/track-item";

export default function Tracklist({ albumTracks }: { albumTracks: Track[] }) {
    return (
        <View style={[styles.container]}>
            <View style={{ marginTop: 24 }}>
                <View
            style={
                styles.trackRow}
        >
            <View style={styles.numberColumn}>
                <Text style={styles.listHeaderText}>#</Text>
            </View>

            <View style={styles.infoColumn}>
                    <Text style={styles.listHeaderText} numberOfLines={1}>
                    
                        Título
                    </Text>
            </View>

            <View style={styles.actionColumn}>
                <Text style={styles.listHeaderText}>
                    0:00
                </Text>
            </View>
        </View>
                {albumTracks.map((track) => (
                    <TrackItem
                        key={track.id}
                        track={track}
                        onPress={() =>
                            console.log(`Tocar música ${track.name}`)
                        }
                    />
                ))}
            </View>
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
        fontWeight: "900",
        marginTop: 4,
    },
    albumArtist: {
        color: "#ccc",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 4,
    },
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
    listHeaderText: {
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
