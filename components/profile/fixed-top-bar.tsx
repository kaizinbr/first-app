import * as React from "react";
import { View, Text, StyleSheet, Pressable, Share, Alert } from "react-native";
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import { useHeaderMeasurements } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
    AltArrowLeft,
    Settings,
    Share as ShareIcon,
} from "@solar-icons/react-native/Outline";
import { SettingsMinimalistic } from "@solar-icons/react-native/Bold";
import { LinearGradient } from "expo-linear-gradient";
import { darkenColor } from "@/lib/util/workWithColors";
import ShareBtn from "@/components/core/share-btn";

function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}

export default function FixedTopBar({
    title,
    height,
    dominantColor = "#161718",
    itsUser = false,
    username,
}: {
    title: string;
    height: number;
    dominantColor?: string;
    itsUser?: boolean;
    username: string;
}) {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    console.log(dominantColor, "cor dominante recebida no FixedTopBar");

    // Puxa a medida de rolagem de forma segura
    const measurements = useHeaderMeasurements();

    // Animações rodando na UI Thread (zero travamentos)
    const animatedStyle = useAnimatedStyle(() => {
        // Fallback para 0 caso o valor seja undefined no primeiro frame
        const scrollValue = measurements.top?.value ?? 0;

        // Conforme a header sobe (fica negativo), nós empurramos a barra pra baixo (positivo)
        const translateY = Math.abs(scrollValue);
        const opacity = interpolate(
            translateY,
            [100, 150],
            [0, 1],
            Extrapolation.CLAMP,
        );

        return {
            transform: [{ translateY }],
            backgroundColor: dominantColor, // Fundo escuro aparecendo
            opacity, // Barra ficando opaca conforme sobe
        };
    });

    const titleStyle = useAnimatedStyle(() => {
        const scrollValue = measurements.top?.value ?? 0;
        const translateY = Math.abs(scrollValue);
        const opacity = interpolate(
            translateY,
            [120, 160],
            [0, 1],
            Extrapolation.CLAMP,
        );

        return { opacity };
    });

    const onShare = async () => {
        console.log("Shared successfully");
        try {
            const result = await Share.share({
                message: "https://whistle.kaizin.work/",
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    return (
        <Animated.View
            style={[
                styles.fixedBar,
                { height: height, paddingTop: insets.top },
                animatedStyle,
            ]}
            pointerEvents="box-none"
        >
            <Pressable
                onPress={() => router.back()}
                style={[styles.backButton, { top: 0 }]}
            >
                <AltArrowLeft size={32} color="#eee" />
            </Pressable>

            <Animated.Text style={[styles.title, titleStyle]}>
                {title}
            </Animated.Text>

            {itsUser ? (
                <View style={{ flexDirection: "row", gap: 8, width: 40, justifyContent: "flex-end" }}>
                    <ShareBtn
                        type="profile"
                        url={`https://whistle.kaizin.work/${username}`}
                    />
                    <Pressable
                        style={[
                            styles.confBtn,
                            { width: 30 },
                        ]}
                        onPress={() => router.push("/settings/menu")}
                    >
                        <Settings size={28} color="#eee" />
                    </Pressable>
                </View>
            ) : (
                <ShareBtn
                    type="profile"
                    url={`https://whistle.kaizin.work/${username}`}
                />
            )}
            <LinearGradient
                colors={[
                    `rgba(${hexToRgb(dominantColor)}, 0)`,
                    darkenColor(dominantColor, 1.2),
                ]}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: height,
                    zIndex: -1,
                }}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    fixedBar: {
        position: "absolute", // Fica flutuando acima da ProfileHeader
        top: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        zIndex: 999, // Fica na frente de tudo
        backgroundColor: "red", // Cor de fundo para debug (remova depois)
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
    },
    confBtn: {
        width: 40,
        height: 30,
        justifyContent: "center",
        alignItems: "flex-end",
    },
    title: {
        color: "#eee",
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: "Walsheim"
    },
});
