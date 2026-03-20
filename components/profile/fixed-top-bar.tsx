import * as React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import { useHeaderMeasurements } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AltArrowLeft } from "@solar-icons/react-native/Outline";

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
}: {
    title: string;
    height: number;
    dominantColor?: string;
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

            {/* Espaço vazio para centralizar o título via flexbox */}
            <View style={{ width: 40 }} />
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
    title: {
        color: "#eee",
        fontSize: 14,
        fontWeight: "bold",
    },
});
