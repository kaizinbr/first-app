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


import { Album, Palette, UserProfile } from "@/lib/types";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { lightenColor, darkenColor } from "@/lib/util/workWithColors";
import AlbumHeader from "@/components/albuns/header";
import AlbumData, { AlbumExtraData } from "@/components/albuns/data";
import Tracklist from "@/components/albuns/tracklist";
import { AltArrowLeft, Star } from "@solar-icons/react-native/Outline";
import { Star as StarBold } from "@solar-icons/react-native/Bold";
import FavoriteAlbumBtn from "@/components/albuns/favorite-album-btn";

export default function AlbumScreen({
    albumData,
    colors,
    userData,
}: {
    albumData: Album;
    colors: Palette;
    userData: UserProfile;
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
                <LinearGradient
                    colors={[colors.muted, "#161718"]} // Troque pela cor dinâmica do álbum depois
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
                    {albumData.name.length > 36
                        ? albumData.name.substring(0, 36) + "..."
                        : albumData.name}
                </Text>
            </Animated.View>

            {/* BOTÃO VOLTAR */}

            <Pressable
                onPress={() => router.back()}
                style={[styles.backButton, { top: insets.top + 4 }]}
            >
                <AltArrowLeft size={32} color="#eee" />
            </Pressable>
            {/* BOTÃO FAVORITAR */}
            {albumData && colors && (
                <View style={[styles.favoriteBtn, { top: insets.top + 4 }]}>
                    <FavoriteAlbumBtn
                        albumData={albumData}
                        size={30}
                    />
                </View>
            )}

            <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [styles.fav, 
                    {
                        backgroundColor: pressed
                            ? darkenColor(selectRightColor(colors), 0.2)
                            : darkenColor(selectRightColor(colors), 0.7),
                    }]}
            >
                <Star size={26} color="#eee" />
            </Pressable>

            <Pressable
                onPress={() =>
                    router.push({
                        pathname: `/(app)/create/review/[id]`,
                        params: { id: albumData.id },
                    })
                }
                style={({ pressed }) => [
                    styles.reviewButton,
                    {
                        backgroundColor: pressed
                            ? darkenColor(selectRightColor(colors), 0.2)
                            : darkenColor(selectRightColor(colors), 0.7),
                    },
                ]}
            >
                <Text
                    style={{ color: "#eee", fontSize: 16, fontWeight: "bold" }}
                >
                    Avaliar álbum
                </Text>
            </Pressable>

            <Animated.ScrollView
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <AlbumHeader
                    maxHeight={HEADER_MAX_HEIGHT}
                    data={albumData}
                    headerContentStyle={headerContentStyle}
                />

                <AlbumData data={albumData} />
                <Tracklist albumTracks={albumData.tracks.items} />
                <AlbumExtraData data={albumData} />

                <View style={{ height: 124 }} />
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
    favoriteBtn: {
        position: "absolute",
        right: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
    },
    reviewButton: {
        position: "absolute",
        left: 16,
        right: 70,
        bottom: 64,
        zIndex: 11,
        height: 46,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1c494f",
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    fav: {
        position: "absolute",
        // left: 16,
        right: 16,
        bottom: 64,
        zIndex: 11,
        height: 46,
        width: 46,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1c494f",
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },

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
