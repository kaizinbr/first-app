import TextDefault from "@/components/core/text-core";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ColorThiefColorData } from "expo-color-thief-native";

import ArtistAlbuns from "@/components/artists/albuns";
import FavoriteArtistBtn from "@/components/artists/favorite-artist-btn";
import Header from "@/components/artists/header";
import FixedHeader from "@/components/core/fixed-header";
import { AltArrowLeftIcon } from "@solar-icons/react-native/linear/alt-arrow-left";
import { ArtistResponse } from "@/lib/types";
import ArtistData from "@/components/artists/data";
import { selectAlbumColor } from "@/lib/util/selectRightColor";

export default function ArtistScreen({
    data,
    palette,
}: {
    data: ArtistResponse;
    palette: ColorThiefColorData[];
}) {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const mainColor = selectAlbumColor(palette).hex;

    const scrollY = useSharedValue(0);

    const HEADER_MAX_HEIGHT = 420; // Tamanho total da área do gradiente
    const HEADER_MIN_HEIGHT = insets.top + 50; // Tamanho da barrinha que vai ficar fixa
    const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const backgroundStyle = useAnimatedStyle(() => {
        const translateY = scrollY.value > 0 ? -scrollY.value : 0;
        const scale =
            scrollY.value < 0
                ? 1 + Math.abs(scrollY.value) / HEADER_MAX_HEIGHT
                : 1;

        return {
            transform: [{ translateY }, { scale }],
        };
    });

    const topBarStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [SCROLL_DISTANCE - 40, SCROLL_DISTANCE],
            [0, 1],
            Extrapolation.CLAMP,
        );
        return { opacity };
    });

    const headerContentStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, SCROLL_DISTANCE / 1.5], // Some um pouco antes da metade do caminho
            [1, 0],
            Extrapolation.CLAMP,
        );
        const scale = interpolate(
            scrollY.value,
            [-100, 0, SCROLL_DISTANCE],
            [1.1, 1, 0.8],
            Extrapolation.CLAMP,
        );
        return { opacity, transform: [{ scale }] };
    });

    return (
        <View style={styles.container}>
            <FixedHeader
                data={data}
                mainColor={mainColor}
                scrollY={scrollY}
                type="artist"
            />

            <Animated.ScrollView
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <Header
                    maxHeight={HEADER_MAX_HEIGHT}
                    data={data}
                    headerContentStyle={headerContentStyle}
                />

                <View
                    style={{
                        position: "absolute",
                        top: HEADER_MAX_HEIGHT - 180,
                        height: 330,
                        zIndex: 1,
                        width: "100%",
                    }}
                >
                    <LinearGradient
                        colors={["transparent", selectAlbumColor(palette).hex]}
                        style={{
                            height: 162,
                            width: "100%",
                        }}
                    />
                    <View
                        style={{
                            height: 16,
                            width: "100%",
                            backgroundColor: selectAlbumColor(palette).hex,
                        }}
                    />
                    <LinearGradient
                        colors={[selectAlbumColor(palette).hex, "transparent"]}
                        style={{
                            height: 162,
                            width: "100%",
                        }}
                    />
                </View>

                <ArtistData data={data} />

                <ArtistAlbuns data={data} />

                <View style={{ height: 124 }} />
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718",
    },
    gradientContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0,
    },
    fixedTopBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#1c494f",
        zIndex: 10,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    favoriteBtn: {
        position: "absolute",
        right: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
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

    textDefault: {
        color: "#eee", // A cor clara para o seu modo escuro
        fontSize: 14,
    },
    title: {
        color: "#989898",
        fontSize: 12,
        fontWeight: "bold",
    },
    sec: {
        backgroundColor: "#212223",
        padding: 16,
        borderRadius: 12,
        gap: 4,
    },
});
