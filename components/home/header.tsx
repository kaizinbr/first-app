import FeedCard from "@/components/home/feed-card";
import api from "@/lib/api";
import { Review } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
    Animated,
    useWindowDimensions,
    Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import Banner from "@/components/home/banner";
import { Settings } from "@solar-icons/react-native/Outline";

import TextDefault from "@/components/core/text-core";
// const HEADER_MAX_HEIGHT = 424;

export default function FeedHeader({
    scrollOffsetY,
}: {
    scrollOffsetY: Animated.Value;
}) {
    const { height } = useWindowDimensions();
    const HEADER_MAX_HEIGHT = height * 0.45;
    const insets = useSafeAreaInsets();
    const { data: session } = authClient.useSession();
    const router = useRouter();

    const [colors, setColors] = useState(["#161718", "#161718"]);

    const Header_Min_Height = insets.top;
    const Scroll_Distance = HEADER_MAX_HEIGHT - Header_Min_Height;

    const bannerOpacity = scrollOffsetY.interpolate({
        inputRange: [0, Scroll_Distance / 1.5],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    const bannerScale = scrollOffsetY.interpolate({
        inputRange: [0, Scroll_Distance],
        outputRange: [1, 0.8],
        extrapolate: "clamp",
    });

    const titleTranslate = scrollOffsetY.interpolate({
        inputRange: [0, Scroll_Distance],
        outputRange: [0, -10],
        extrapolate: "clamp",
    });

    return (
        // Este View tem a altura exata do header — o gradiente fica atrás de tudo
        <View style={{ height: HEADER_MAX_HEIGHT }}>
            <LinearGradient
                colors={[colors[0], "transparent"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            <LinearGradient
                colors={[colors[1], "transparent"]}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 1 }}
                style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
            />
            <LinearGradient
                colors={["transparent", "rgba(22,23,24,1)"]}
                start={{ x: 0.5, y: 0.1 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Conteúdo do header */}
            <View style={[styles.headerContent, { paddingTop: insets.top }]}>
                <Animated.View
                    style={{
                        transform: [{ translateY: titleTranslate }],
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        paddingHorizontal: 24,
                        marginVertical: 12,
                    }}
                >
                    <Animated.Text
                        style={[
                            styles.title,
                            { transform: [{ translateY: titleTranslate }] },
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
                    style={{
                        opacity: bannerOpacity,
                        // transform: [{ scale: bannerScale }],
                        width: "100%",
                        flex: 1,
                        alignItems: "center",
                    }}
                >
                    <Banner
                        onColorChange={setColors}
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
});
