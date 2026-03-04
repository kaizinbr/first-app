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
    Animated,
} from "react-native";
import { useRouter, Link } from "expo-router";
import {
    useSafeAreaInsets,
    SafeAreaView,
} from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import Banner from "@/components/home/banner";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

import { useState, useRef } from "react";

export default function HomeHeader({ value }: any) {
    const { data: session } = authClient.useSession();
    const insets = useSafeAreaInsets();
    const Header_Max_Height = 374;
    const Header_Min_Height = insets.top;
    const Scroll_Distance = Header_Max_Height - Header_Min_Height;

    const animatedHeaderHeight = value.interpolate({
        inputRange: [0, Scroll_Distance],
        outputRange: [Header_Max_Height, Header_Min_Height],
        extrapolate: "clamp",
    });

    const animatedHeaderColor = value.interpolate({
        inputRange: [0, Scroll_Distance],
        outputRange: ["#181D31", "#161718"],
        extrapolate: "clamp",
    });

    const bannerOpacity = value.interpolate({
        inputRange: [0, Scroll_Distance / 1.5], // Termina a animação um pouco antes do final
        outputRange: [1, 0], // Vai de 100% visível para 0%
        extrapolate: "clamp",
    });

    const bannerScale = value.interpolate({
        inputRange: [0, Scroll_Distance],
        outputRange: [1, 0.8], // Vai do tamanho normal (1) para 80% (0.8)
        extrapolate: "clamp",
    });

    return (
        <Animated.View
            style={[
                styles.header,
                {
                    height: animatedHeaderHeight,
                    backgroundColor: animatedHeaderColor,
                    paddingTop: insets.top,
                    overflow: "hidden",
                },
            ]}
        >
            <Text style={styles.title}>
                Olá, {session?.user?.name || "usuário"}!
            </Text>
            <Animated.View
                style={{
                    opacity: bannerOpacity,
                    transform: [{ scale: bannerScale }],
                    width: "100%",
                    alignItems: "center",
                    flex: 1,
                }}
            >
                <Banner />
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: "absolute", // Position the header absolutely at the top
        top: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "flex-start",
        zIndex: 1, // Ensure the header is above the scroll view content
        gap: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        textAlign: "left",
        marginTop: 24,
        color: "#eeeeee",
        paddingHorizontal: 16,
    },
});
