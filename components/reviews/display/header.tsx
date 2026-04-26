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
import TextDefault from "@/components/core/text-core";

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
                    minHeight: 264,
                    justifyContent: "flex-end",
                },
            ]}
        >
            <Animated.View style={headerContentStyle}>
                <Image
                    source={{ uri: data.images[0].url }}
                    style={styles.albumArt}
                />
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        paddingHorizontal: 16,
        backgroundColor: "transparent",
    },
    albumArt: {
        width: "20%",
        height: "auto",
        aspectRatio: 1,
        minHeight: 128,
        minWidth: 128,
        borderRadius: 10,
        marginTop: 112,
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
});
