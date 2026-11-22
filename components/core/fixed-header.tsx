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
import FavoriteAlbumBtn from "@/components/albuns/favorite-album-btn";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AltArrowLeftIcon } from "@solar-icons/react-native/outline/alt-arrow-left";
import FavoriteArtistBtn from "@/components/artists/favorite-artist-btn";

export default function FixedHeader({
    mainColor,
    data,
    scrollY,
    type
}: {
    mainColor: string;
    data: Album | ArtistResponse;
    scrollY: any;
    type?: "album" | "artist" | "review";
}) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const HEADER_MAX_HEIGHT = 400; // Tamanho total da área do gradiente
    const HEADER_MIN_HEIGHT = insets.top + 50; // Tamanho da barrinha que vai ficar fixa
    const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const topBarStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [SCROLL_DISTANCE - 40, SCROLL_DISTANCE],
            [0, 1],
            Extrapolation.CLAMP,
        );
        const transform = [
            {
                translateY: interpolate(
                    scrollY.value,
                    [SCROLL_DISTANCE - 40, SCROLL_DISTANCE],
                    [-32, 0],
                    Extrapolation.CLAMP,
                ),
            },
        ];
        return { opacity, transform };
    });

    const statusBarOpacityStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            scrollY.value,
            [SCROLL_DISTANCE - 40, SCROLL_DISTANCE],
            [0, 1],
            Extrapolation.CLAMP,
        ),
    }));

    // const backBtnStyle = useAnimatedStyle(() => ({
    //     backgroundColor: interpolate(
    //         scrollY.value,
    //         [SCROLL_DISTANCE - 40, SCROLL_DISTANCE],
    //         [0.3, 0.7],
    //         Extrapolation.CLAMP,
    //     ),
    // }));

    return (
        <>
            <Animated.View
                style={[
                    styles.statusBarBg,
                    { height: insets.top + 24 },
                    statusBarOpacityStyle,
                ]}
                pointerEvents="none"
            >
                <LinearGradient
                    colors={["#161718", "transparent"]}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>

            <Pressable
                onPress={() => router.back()}
                style={[
                    styles.backButton,
                    {
                        top: insets.top + 4,
                        backgroundColor: darkenColor(mainColor, 0.3),
                    },
                ]}
            >
                <AltArrowLeftIcon
                    style={{ left: -2 }}
                    size={24}
                    strokeWidth={3}
                    color="#eee"
                />
            </Pressable>

            {data && type === "album" ? (
                <View style={[styles.favoriteBtn, { top: insets.top + 4, backgroundColor: darkenColor(mainColor, 0.3) }]}>
                    <FavoriteAlbumBtn
                        albumData={data as Album}
                        size={24}
                        strokeWidth={3}
                    />
                </View>
            ) : type === "artist" ? (
                <View style={[styles.favoriteBtn, { top: insets.top + 4, backgroundColor: darkenColor(mainColor, 0.3) }]}>
                    <FavoriteArtistBtn
                        artistData={data as ArtistResponse}
                        size={24}
                    />
                </View>
            ) : null}

            <Animated.View
                style={[
                    styles.fixedTopBar,
                    {
                        height: HEADER_MIN_HEIGHT,
                        paddingTop: insets.top,
                    },
                    topBarStyle,
                ]}
                pointerEvents="none" // Para não bloquear o clique de voltar
            >
                <View
                    style={[
                        styles.fixedTitleContainer,
                        { backgroundColor: darkenColor(mainColor, 0.3) },
                    ]}
                >
                    <TextDefault style={styles.fixedTitle} numberOfLines={1}>
                        {data.name.length > 32
                            ? data.name.substring(0, 32) + "..."
                            : data.name}
                    </TextDefault>
                </View>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718", // Cor de fundo do resto do app
    },

    statusBarBg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        zIndex: 10,
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
        // backgroundColor: "#1c494f", // Cor final da barrinha
        zIndex: 10,
        alignItems: "center",
        justifyContent: "center",
        // borderBottomWidth: 1,
        // borderBottomColor: "rgba(255,255,255,0.05)",
    },
    fixedTitleContainer: {
        borderRadius: 9999,
        height: 40,
        maxWidth: "70%",
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(22,23,24,0.7)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    fixedTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "semibold",
    },
    backButton: {
        position: "absolute",
        left: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
        backgroundColor: "rgba(22,23,24,0.7)",
        alignItems: "center",
        borderRadius: 999,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    favoriteBtn: {
        position: "absolute",
        right: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        backgroundColor: "rgba(22,23,24,0.7)",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
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
