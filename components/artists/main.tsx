import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import TextDefault from "@/components/core/text-core";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ArtistAlbuns from "@/components/artists/albuns";
import Header from "@/components/artists/header";
import { ArtistResponse, Palette } from "@/lib/types";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { darkenColor } from "@/lib/util/workWithColors";
import { AltArrowLeft } from "@solar-icons/react-native/Outline";
import FavoriteArtistBtn from "@/components/artists/favorite-artist-btn";
function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}
export default function ArtistScreen({
    data,
    colors,
}: {
    data: ArtistResponse;
    colors: Palette;
}) {
    const insets = useSafeAreaInsets();
    const router = useRouter();

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
            <Animated.View
                style={[
                    styles.gradientContainer,
                    { height: HEADER_MAX_HEIGHT },
                    backgroundStyle,
                ]}
            >
                <LinearGradient
                    colors={[selectRightColor(colors), "#161718"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
                <LinearGradient
                    colors={[colors.muted, "#161718"]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
                />
                <LinearGradient
                    colors={["transparent", "rgba(22, 23, 24, 1)"]}
                    start={{ x: 0.5, y: 0.2 }}
                    end={{ x: 0.5, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>

            <Animated.View
                style={[
                    styles.fixedTopBar,
                    {
                        height: HEADER_MIN_HEIGHT,
                        paddingTop: insets.top,
                        backgroundColor: darkenColor(
                            selectRightColor(colors),
                            0.7,
                        ),
                    },
                    topBarStyle,
                ]}
                pointerEvents="none"
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

            <Pressable
                onPress={() => router.back()}
                style={[styles.backButton, { top: insets.top + 4 }]}
            >
                <AltArrowLeft size={32} color="#eee" />
            </Pressable>

            <View style={[styles.favoriteBtn, { top: insets.top + 4 }]}>
                <FavoriteArtistBtn artistData={data} size={32} />
            </View>

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

                <View style={{ padding: 16, gap: 16 }}>
                    {data.description && (
                        <View style={styles.sec}>
                            <TextDefault style={styles.title}>Biografia</TextDefault>
                            <TextDefault style={styles.textDefault}>
                                {data.description}
                            </TextDefault>
                        </View>
                    )}
                    <ArtistAlbuns data={data} />
                </View>

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
        backgroundColor: "#1b1c1d",
        padding: 16,
        borderRadius: 12,
        gap: 4,
    },
});
