import FeedCard from "@/components/home/feed-card";
import api from "@/lib/api";
import { Review } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    View,
    useWindowDimensions,
    Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import Banner from "@/components/test/banner";
import { Settings } from "@solar-icons/react-native/Outline";
import { Palette } from "@/lib/types";
import { selectRightColor } from "@/lib/util/selectRightColor";
import {
    lightenColor,
    darkenColor,
    getBannerColors,
} from "@/lib/util/workWithColors";
import { getColors } from "react-native-image-colors";
import TextDefault from "@/components/core/text-core";

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolateColor,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";

// const HEADER_MAX_HEIGHT = 424;

function useColorTransition(color: string, duration = 500) {
    const colorProgress = useSharedValue(0);
    const prevColor = useSharedValue(color);
    const nextColor = useSharedValue(color);

    useEffect(() => {
        prevColor.value = nextColor.value;
        nextColor.value = color;
        colorProgress.value = 0;
        colorProgress.value = withTiming(1, { duration });
    }, [color]);

    return useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            colorProgress.value,
            [0, 1],
            [prevColor.value, nextColor.value],
        ),
    }));
}

export default function FeedHeader({
    scrollOffsetY,
}: {
    scrollOffsetY: SharedValue<number>;
}) {
    const { height } = useWindowDimensions();
    const HEADER_MAX_HEIGHT = height * 0.45;
    const insets = useSafeAreaInsets();
    const { data: session } = authClient.useSession();
    const router = useRouter();

    const [colors, setColors] = useState<any>(["#182840", "#00001a"]);

    const [currentBannerUrl, setCurrentBannerUrl] = useState<string>(
        "https://i.scdn.co/image/ab67616d0000b2735f42ea05cfc5233136e8546a",
    );

    const Header_Min_Height = insets.top;
    const Scroll_Distance = HEADER_MAX_HEIGHT - Header_Min_Height;

    const bannerOpacityStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            scrollOffsetY.value,
            [0, Scroll_Distance / 1.5],
            [1, 0],
            Extrapolation.CLAMP,
        ),
    }));

    const titleTranslateStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: interpolate(
                    scrollOffsetY.value,
                    [0, Scroll_Distance],
                    [0, -10],
                    Extrapolation.CLAMP,
                ),
            },
        ],
    }));

    const blob1Style = useColorTransition(colors[0]);
    const blob2Style = useColorTransition(lightenColor(colors[0], 1));
    const blob3Style = useColorTransition(lightenColor(colors[0], 0.7));
    const blob4Style = useColorTransition(lightenColor(colors[0], 0.8));

    useEffect(() => {
        console.log("Cores do banner:", currentBannerUrl);

        const fetchColors = async () => {
            const result = await getColors(currentBannerUrl, {
                fallback: "#000000",
                cache: true,
                key: currentBannerUrl, // Use a URL como chave de cache
            });
            console.log("Resultado do getColors:", result);
            const newColors = getBannerColors(result);
            setColors(newColors);
            console.log("Nova cor:", newColors[0]);
        };

        fetchColors();
    }, [currentBannerUrl]);

    return (
        // Este View tem a altura exata do header — o gradiente fica atrás de tudo
        <View style={{ height: HEADER_MAX_HEIGHT }}>
            {colors && (
                <Animated.View
                    style={[
                        styles.gradientContainer,
                        { height: HEADER_MAX_HEIGHT },
                    ]}
                >
                    {/* <LinearGradient
                        colors={[darkenColor(colors[0], 1.5), "#161718"]}
                        style={[StyleSheet.absoluteFill, { transitionProperty: "background-color", transitionDuration: "500ms" }]}
                    /> */}

                    <Animated.View
                        style={[
                            styles.blob,
                            blob1Style,
                            {
                                width: 320,
                                height: 320,
                                top: -80,
                                left: -60,
                                filter: [{ blur: 90 }],
                            },
                        ]}
                    />

                    <Animated.View
                        style={[
                            styles.blob,
                            blob2Style,
                            {
                                width: 260,
                                height: 260,
                                bottom: 170,
                                right: -80,
                                filter: [{ blur: 70 }],
                            },
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.blob,
                            blob3Style,
                            {
                                width: 160,
                                height: 160,
                                bottom: 80,
                                right: 80,
                                filter: [{ blur: 70 }],
                            },
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.blob,
                            blob4Style,
                            {
                                width: 160,
                                height: 160,
                                top: 130,
                                left: 80,
                                filter: [{ blur: 70 }],
                            },
                        ]}
                    />

                    {/* vinheta no topo pra escurecer onde fica o header */}
                    <LinearGradient
                        colors={["rgba(0,0,0,0.6)", "transparent"]}
                        style={[StyleSheet.absoluteFill, { height: 180 }]}
                    />
                </Animated.View>
            )}

            {/* Conteúdo do header */}
            <View style={[styles.headerContent, { paddingTop: insets.top }]}>
                <Animated.View
                    style={[
                        titleTranslateStyle,
                        {
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            paddingHorizontal: 24,
                            marginVertical: 12,
                        },
                    ]}
                >
                    <Animated.Text
                        style={[
                            styles.title,
                            titleTranslateStyle,
                        ]}
                    >
                        {/* Olá, {session?.user?.name || "usuário"}! */}
                        Whistle
                    </Animated.Text>
                    <Pressable onPress={() => router.push("/settings/menu")}>
                        <Settings size={28} color="#eeeeee" />
                    </Pressable>
                </Animated.View>

                <Animated.View
                    style={[
                        bannerOpacityStyle,
                        {
                            // transform: [{ scale: bannerScale }],
                            width: "100%",
                            flex: 1,
                            alignItems: "center",
                        },
                    ]}
                >
                    <Banner
                        onColorChange={setColors}
                        setCurrentBannerUrl={setCurrentBannerUrl}
                        HEADER_MAX_HEIGHT={HEADER_MAX_HEIGHT}
                    />
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, width: "100%" },
    headerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 16,
        marginBottom: 80,
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        color: "#eeeeee",
        fontFamily: "Walsheim",
    },
    feed: { paddingBottom: 56 },
    h2: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "left",
        marginTop: 32,
        marginBottom: 16,
        color: "#eeeeee",
        paddingHorizontal: 16,
    },

    blob: {
        position: "absolute",
        borderRadius: 999,
        opacity: 0.6,
    },
    gradientContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0, // Fica atrás do ScrollView
    },
});