import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import Animated, {
    useAnimatedStyle,
    useAnimatedScrollHandler,
    useSharedValue,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Review, Album, Palette } from "@/lib/types";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { lightenColor, darkenColor } from "@/lib/util/workWithColors";

export default function AlbumScreen({
    reviewData,
    albumData,
    colors,
}: {
    reviewData: Review;
    albumData: Album;
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

    // 1. A MÁGICA DO FUNDO: Rola junto com a tela!
    const backgroundStyle = useAnimatedStyle(() => {
        // Se rolar pra baixo (scroll positivo), o fundo sobe na mesma velocidade (-scrollY)
        // Se puxar a tela pra cima (bounce negativo), ele trava no 0 para não desgrudar do topo.
        const translateY = scrollY.value > 0 ? -scrollY.value : 0;

        // Dá uma leve esticada no gradiente se o usuário puxar a tela (overscroll)
        const scale =
            scrollY.value < 0
                ? 1 + Math.abs(scrollY.value) / HEADER_MAX_HEIGHT
                : 1;

        return {
            transform: [{ translateY }, { scale }],
        };
    });

    // 2. A MÁGICA DA HEADER FIXA: Nasce quando o gradiente vai embora
    const topBarStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [SCROLL_DISTANCE - 40, SCROLL_DISTANCE], // Começa a aparecer 40px antes de bater no topo
            [0, 1],
            Extrapolation.CLAMP,
        );
        return { opacity };
    });

    // 3. Animação da Capa e Título sumindo
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
            {/* O FUNDO GRADIENTE ANIMADO */}
            <Animated.View
                style={[
                    styles.gradientContainer,
                    { height: HEADER_MAX_HEIGHT },
                    backgroundStyle,
                ]}
            >
                {/* Camada 1: A cor principal (Ex: Verde escuro) descendo na diagonal */}
                <LinearGradient
                    colors={[selectRightColor(colors), "#161718"]} // Troque pela cor dinâmica do álbum depois
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
                {/* Camada 2: Uma sombra que vem de baixo pra criar a "profundidade" do mesh */}
                <LinearGradient
                    colors={["transparent", "rgba(22, 23, 24, 1)"]}
                    start={{ x: 0.5, y: 0.2 }}
                    end={{ x: 0.5, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
                {/* <View
                    style={{
                        height: 250,
                        width: 250,
                        backgroundColor: lightenColor(
                            selectRightColor(colors),
                            0.2,
                        ),
                        right: -75,
                        top: -75,
                        position: "absolute",
                        borderRadius: 9999,
                        filter: "blur(50px)",
                    }}
                ></View> */}
            </Animated.View>

            {/* A BARRINHA FIXA QUE APARECE */}
            <Animated.View
                style={[
                    styles.fixedTopBar,
                    {
                        height: HEADER_MIN_HEIGHT,
                        paddingTop: insets.top,
                        backgroundColor: darkenColor(selectRightColor(colors), 0.7),
                    },
                    topBarStyle,
                ]}
                pointerEvents="none" // Para não bloquear o clique de voltar
            >
                <Text style={styles.fixedTitle} numberOfLines={1}>
                    NOT CUTE ANYMORE
                </Text>
            </Animated.View>

            {/* BOTÃO VOLTAR */}
            <Pressable
                onPress={() => router.back()}
                style={[styles.backButton, { top: insets.top }]}
            >
                <Text
                    style={{ color: "#eee", fontSize: 24, fontWeight: "bold" }}
                >
                    ←
                </Text>
            </Pressable>

            {/* O CONTEÚDO DA PÁGINA */}
            <Animated.ScrollView
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                {/* O ESPAÇO TRANSPARENTE: Tem o mesmo tamanho exato do gradiente! */}
                <View
                    style={{
                        height: HEADER_MAX_HEIGHT,
                        justifyContent: "flex-end",
                        paddingBottom: 24,
                        paddingHorizontal: 20,
                    }}
                >
                    <Animated.View style={headerContentStyle}>
                        <Image
                            source={{ uri: albumData.images[0].url }}
                            style={styles.albumArt}
                        />
                        <Text style={styles.albumType}>{(() => {
                                switch (albumData.type) {
                                    case "album":
                                        return "Álbum";
                                    case "single":
                                        return "Single/EP";
                                    case "compilation":
                                        return "Compilação";
                                    default:
                                        return "Outro";
                                }
                            })()}</Text>
                        <Text style={styles.albumTitle}>{albumData.name}</Text>
                        <Text style={styles.albumArtist}>
                            {albumData.artists
                                .map((artist: any) => artist.name)
                                .join(", ")}
                        </Text>
                    </Animated.View>
                </View>

                {/* O CONTEÚDO SÓLIDO: Começa exatamente onde o gradiente termina */}
                <View style={styles.lowerContent}>
                    <Text style={styles.sectionTitle}>
                        Avaliação de kako triste
                    </Text>
                    <Text style={styles.score}>89.5/100</Text>
                    <Text style={styles.date}>21/12/2025</Text>

                    {/* Falsos cards para dar rolagem */}
                    {[...Array(20)].map((_, i) => (
                        <View key={i} style={styles.fakeReviewCard} />
                    ))}
                </View>
            </Animated.ScrollView>
        </View>
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
    albumArt: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
        alignSelf: "center",
        // Sombra leve para destacar no gradiente
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    albumType: { color: "#eee", fontSize: 12, fontWeight: "600" },
    albumTitle: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "900",
        marginTop: 4,
    },
    albumArtist: {
        color: "#ccc",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 4,
    },

    // AQUI ESTÁ O SEGREDO DO ENCAIXE PERFEITO
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
});
