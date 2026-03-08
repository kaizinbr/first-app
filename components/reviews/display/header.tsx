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

export default function AlbumHeader({
    maxHeight,
    data,
    headerContentStyle,
}: any) {
    return (
        <Animated.View
            style={[
                styles.container,
                {
                    height: maxHeight + 24,
                    justifyContent: "flex-end",
                    paddingBottom: 24,
                },
            ]}
        >
            <Animated.View style={headerContentStyle}>
                <Image
                    source={{ uri: data.images[0].url }}
                    style={styles.albumArt}
                />
                <Text style={styles.albumType}>
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
                    })()}
                </Text>
                <Text style={styles.albumTitle}>{data.name}</Text>
                <Text style={styles.albumArtist}>
                    {data.artists.map((artist: any) => artist.name).join(", ")}
                </Text>
            </Animated.View>
        </Animated.View>
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
        marginBottom: 28,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    albumType: { color: "#eee", fontSize: 12, fontWeight: "600" },
    albumTitle: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "900",
        marginTop: 4,
    },
    albumArtist: {
        color: "#ccc",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 4,
    },
});
