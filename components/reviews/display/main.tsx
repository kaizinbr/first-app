import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AlbumData, { AlbumExtraData } from "@/components/reviews/display/data";
import AlbumHeader from "@/components/reviews/display/header";
import ReviewScore from "@/components/reviews/display/score";
import ReviewContent from "@/components/reviews/display/review-content";
import Tracklist from "@/components/reviews/display/tracklist";
import { Album, Palette, Review } from "@/lib/types";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { darkenColor } from "@/lib/util/workWithColors";

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

    const HEADER_MAX_HEIGHT = 264; // Tamanho total da área do gradiente
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
        return { opacity };
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
                                <LinearGradient
                                    colors={[colors.muted, "#161718"]} // Troque pela cor dinâmica do álbum depois
                                    start={{ x: 1, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
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
                        backgroundColor: darkenColor(
                            selectRightColor(colors),
                            0.7,
                        ),
                    },
                    topBarStyle,
                ]}
                pointerEvents="none" // Para não bloquear o clique de voltar
            >
                <Text style={styles.fixedTitle} numberOfLines={1}>
                    {albumData.name}
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
                style={{ zIndex: 1, marginBottom: 56 }}
            >
                <View
                    style={{
                        backgroundColor: "transparent",
                        paddingBottom: 16,
                        flexDirection: "row",
                    }}
                >
                    <AlbumHeader
                        maxHeight={HEADER_MAX_HEIGHT}
                        data={albumData}
                        headerContentStyle={headerContentStyle}
                    />
                    <AlbumData
                        data={albumData}
                        headerContentStyle={headerContentStyle}
                    />
                </View>
                <ReviewScore review={reviewData} />
                <ReviewContent review={reviewData} />
                <Tracklist
                    review={reviewData}
                    albumTracks={albumData.tracks.items}
                />
                <AlbumExtraData data={albumData} />
                <View style={{ height: 100 }} /> 
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718",
        // paddingBottom: 100,
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

    // AQUI ESTÁ O SEGREDO DO ENCAIXE PERFEITO
    lowerContent: {
        backgroundColor: "#161718", // A mesma cor que o gradiente termina
        paddingHorizontal: 16,
    },
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
});
