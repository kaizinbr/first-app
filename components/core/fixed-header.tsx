import Animated, {
    useAnimatedStyle,
    useAnimatedScrollHandler,
    useSharedValue,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import TextDefault from "@/components/core/text-core";
import { Album, Palette, UserProfile, ArtistResponse } from "@/lib/types";
import { selectRightColor } from "@/lib/util/selectRightColor";
import {
    lightenColor,
    darkenColor,
    getBannerColors,
} from "@/lib/util/workWithColors";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}

export default function FixedHeader({
    colors,
    data,
    scrollY,
}: {
    colors: Palette;
    data: Album | ArtistResponse;
    scrollY: any;
}) {
    const insets = useSafeAreaInsets();

    const HEADER_MAX_HEIGHT = 420; // Tamanho total da área do gradiente
    const HEADER_MIN_HEIGHT = insets.top + 50; // Tamanho da barrinha que vai ficar fixa
    const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

    const [testColor1, testColor2] = getBannerColors(colors);

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const topBarStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [SCROLL_DISTANCE - 40, SCROLL_DISTANCE], // Começa a aparecer 40px antes de bater no topo
            [0, 1],
            Extrapolation.CLAMP,
        );
        return { opacity };
    });
    return (
        <Animated.View
            style={[
                styles.fixedTopBar,
                {
                    height: HEADER_MIN_HEIGHT,
                    paddingTop: insets.top,
                    backgroundColor: darkenColor(selectRightColor(colors), 0.3),
                },
                topBarStyle,
            ]}
            pointerEvents="none" // Para não bloquear o clique de voltar
        >
            <TextDefault style={styles.fixedTitle} numberOfLines={1}>
                {data.name.length > 36
                    ? data.name.substring(0, 36) + "..."
                    : data.name}
            </TextDefault>

            <LinearGradient
                colors={[
                    `rgba(${hexToRgb(selectRightColor(colors))}, 0)`,
                    darkenColor(selectRightColor(colors), 1.2),
                ]}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: HEADER_MIN_HEIGHT,
                    zIndex: -1,
                }}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718", // Cor de fundo do resto do app
    },
    gradientContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0, // Fica atrás do ScrollView
    },
    fixedTopBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#1c494f", // Cor final da barrinha
        zIndex: 10,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    fixedTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    backButton: {
        position: "absolute",
        left: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
    },
    favoriteBtn: {
        position: "absolute",
        right: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
    },
    reviewButton: {
        position: "absolute",
        left: 16,
        right: 70,
        bottom: 64,
        zIndex: 11,
        height: 46,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1c494f",
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    fav: {
        position: "absolute",
        // left: 16,
        right: 16,
        bottom: 64,
        zIndex: 11,
        height: 46,
        width: 46,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1c494f",
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },

    lowerContent: {
        backgroundColor: "#161718", // A mesma cor que o gradiente termina
        paddingHorizontal: 20,
        paddingTop: 24,
        minHeight: 1000,
    },
    sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    score: { color: "#fff", fontSize: 36, fontWeight: "900", marginTop: 8 },
    date: { color: "#777", fontSize: 14, marginTop: 4 },
    fakeReviewCard: {
        height: 80,
        backgroundColor: "#1e1e1e",
        borderRadius: 8,
        marginTop: 12,
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
    blob: {
        position: "absolute",
        borderRadius: 999,
        opacity: 0.6,
        // blur no RN é via style diretamente no iOS
        // no Android precisa de uma alternativa
    },
});
