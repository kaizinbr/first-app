import * as React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from "react-native-reanimated";
import { useHeaderMeasurements } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { UserProfile } from "@/lib/types";

export default function FixedTopBar({ title }: { title: string }) {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    
    // Puxa a medida de rolagem de forma segura
    const { top } = useHeaderMeasurements();

    // Animações rodando na UI Thread (zero travamentos)
    const animatedStyle = useAnimatedStyle(() => {
        // Fallback para 0 caso o valor seja undefined no primeiro frame
        const scrollValue = top?.value ?? 0;
        
        // Conforme a header sobe (fica negativo), nós empurramos a barra pra baixo (positivo)
        const translateY = Math.abs(scrollValue);
        const opacity = interpolate(translateY, [100, 150], [0, 1], Extrapolation.CLAMP);

        return {
            transform: [{ translateY }],
            backgroundColor: `rgba(22, 23, 24, ${opacity})`, // Fundo escuro aparecendo
        };
    });

    const titleStyle = useAnimatedStyle(() => {
        const scrollValue = top?.value ?? 0;
        const translateY = Math.abs(scrollValue);
        const opacity = interpolate(translateY, [120, 160], [0, 1], Extrapolation.CLAMP);

        return { opacity };
    });

    return (
        <Animated.View 
            style={[styles.fixedBar, { height: insets.top + 50, paddingTop: insets.top }, animatedStyle]}
            pointerEvents="box-none" // 👈 CRUCIAL: Impede que a barra invisível bloqueie cliques no perfil
        >
            <Pressable onPress={() => router.back()} style={styles.backButton}>
                <Text style={{ color: "#eee", fontSize: 24, fontWeight: "bold" }}>←</Text>
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
        fontSize: 18,
        fontWeight: "bold",
    },
});