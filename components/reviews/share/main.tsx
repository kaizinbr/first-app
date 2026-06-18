import TextDefault from "@/components/core/text-core";
import ReviewCard from "@/components/reviews/share/reviewcard"; // ajuste o path conforme seu projeto
import { Album, Palette, Review } from "@/lib/types";
import Feather from "@expo/vector-icons/Feather";
import { AltArrowLeft } from "@solar-icons/react-native/Linear";
import {
    LinkMinimalistic2,
    SquareShareLine
} from "@solar-icons/react-native/Outline";

import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { Asset, requestPermissionsAsync } from "expo-media-library";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";

import { getPalette } from "@b.taranenko/expo-color-thief";

// Dimensões fixas do card de alta resolução (offscreen)
const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1920;

const COLOR_OPTIONS = [
    { key: "dominant", label: "Dominant" },
    { key: "vibrant", label: "Vibrant" },
    { key: "darkVibrant", label: "Dark Vibrant" },
    { key: "lightVibrant", label: "Light Vibrant" },
    { key: "muted", label: "Muted" },
    { key: "darkMuted", label: "Dark Muted" },
    { key: "lightMuted", label: "Light Muted" },
] as const;

type ColorOptionKey = (typeof COLOR_OPTIONS)[number]["key"];

export default function ShareReview({
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

    const [colorOne, setColorOne] = useState(colors.dominant);
    const [colorTwo, setColorTwo] = useState(colors.vibrant);
    const [isLoading, setIsLoading] = useState(false);

    // Ref aponta para o card offscreen — renderizado no tamanho real de captura
    const previewRef = useRef<View>(null);

    const getColorValue = (key: ColorOptionKey): string => {
        switch (key) {
            case "dominant":
                return colors.dominant;
            case "vibrant":
                return colors.vibrant;
            case "darkVibrant":
                return colors.darkVibrant;
            case "lightVibrant":
                return colors.lightVibrant;
            case "muted":
                return colors.muted;
            case "darkMuted":
                return colors.darkMuted;
            case "lightMuted":
                return colors.lightMuted;
        }
    };

    const captureCard = async (): Promise<string> => {
        return captureRef(previewRef, {
            format: "png",
            quality: 1,
            result: "tmpfile",
            // Sem width/height aqui — captura o tamanho real do componente (1080×1920)
        });
    };

    const handleShare = async () => {
        setIsLoading(true);
        try {
            const uri = await captureCard();
            await Sharing.shareAsync(uri, {
                mimeType: "image/png",
                dialogTitle: "Compartilhar review",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyLink = async () => {
        // tenta usar propriedades comumente presentes; se não houver, monta uma url padrão com id
        const url =
            (reviewData as any).shareUrl ||
            (reviewData as any).url ||
            `https://whistle.kaizin.work/${(reviewData.shorten as any)}`;
        try {
            await Clipboard.setStringAsync(url);
        } catch (e) {
            console.error("Erro ao copiar link:", e);
        }
    };

    const handleSaveToGallery = async () => {
        setIsLoading(true);
        try {
            const { status } = await requestPermissionsAsync();
            if (status !== "granted") return;
            const uri = await captureCard();
            await Asset.create(uri);
        } finally {
            setIsLoading(false);
        }
    };

    const [colorsA, setColors] = useState<any>(null);

    useEffect(() => {
        const fetchColors = async () => {
            if (albumData.images && albumData.images.length > 0) {
                const imageUrl = albumData.images[0].url;
                try {
                    const fetchedColors = await getPalette(imageUrl, {
                        colorCount: 8,
                        quality: 10,
                    });
                    setColors(fetchedColors);
                    console.log(
                        "Colors fetched for album image:",
                        fetchedColors,
                    );
                } catch (error) {
                    console.error("Erro ao buscar cores da imagem:", error);
                }
            }
        };
        fetchColors();
    }, [albumData]);

    return (
        <>
            {/* Card offscreen em resolução full — fora da viewport, mas montado no DOM */}
            <View
                // ref={offscreenRef}
                style={{
                    position: "absolute",
                    top: -CARD_HEIGHT,
                    left: -CARD_WIDTH,
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                    overflow: "hidden",
                }}
                pointerEvents="none"
            >
                <ReviewCard
                    reviewData={reviewData}
                    albumData={albumData}
                    colorOne={colorOne}
                    colorTwo={colorTwo}
                    width={CARD_WIDTH}
                />
            </View>

            {/* Status bar overlay */}
            <Animated.View
                style={[styles.statusBarBg, { height: insets.top + 24 }]}
                pointerEvents="none"
            >
                <LinearGradient
                    colors={["#161718", "transparent"]}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>

            <Pressable
                onPress={() => router.back()}
                style={[styles.backButton, { top: insets.top + 4 }]}
            >
                <AltArrowLeft size={32} color="#eee" />
            </Pressable>

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <View ref={previewRef} style={styles.previewWrapper}>
                        <ReviewCard
                            reviewData={reviewData}
                            albumData={albumData}
                            colorOne={colorOne}
                            colorTwo={colorTwo}
                            width={312} // ~80% de uma tela de 375 pt
                        />
                    </View>

                    {/* Seletores de cor */}
                    <View style={styles.colorRow}>
                        {colorsA && (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                key="Palette"
                                style={styles.section}
                            >
                                <View style={styles.colorGrid}>
                                    {COLOR_OPTIONS.map((option) => (
                                        <Pressable
                                            key={option.key}
                                            style={[
                                                styles.colorSwatch,
                                                {
                                                    backgroundColor:
                                                        getColorValue(
                                                            option.key,
                                                        ),
                                                },
                                            ]}
                                            onPress={() => {
                                                const val = getColorValue(
                                                    option.key,
                                                );
                                                setColorOne(val);
                                            }}
                                        />
                                    ))}
                                    {colorsA.map((colors: { hex: string }) => (
                                        <Pressable
                                            key={colors.hex}
                                            style={[
                                                styles.colorSwatch,
                                                {
                                                    backgroundColor: colors.hex,
                                                },
                                            ]}
                                            onPress={() => {
                                                setColorOne(colors.hex);
                                            }}
                                        />
                                    ))}
                                </View>
                            </ScrollView>
                        )}
                    </View>

                    <View
                        style={{ flexDirection: "row", gap: 8, marginTop: 16 }}
                    >
                        <View style={{ alignItems: "center", width: 48 }}>
                            <Pressable
                                onPress={handleCopyLink}
                                style={styles.btn}
                            >
                                <LinkMinimalistic2 size={24} color="#eee" />
                            </Pressable>
                            <TextDefault style={styles.btnText}>
                                Copiar link
                            </TextDefault>
                        </View>
                        <View style={{ alignItems: "center", width: 48 }}>
                            <Pressable onPress={handleShare} style={styles.btn}>
                                <SquareShareLine size={24} color="#eee" />
                            </Pressable>
                            <TextDefault style={styles.btnText}>
                                Enviar
                            </TextDefault>
                        </View>
                        <View style={{ alignItems: "center", width: 48 }}>
                            <Pressable
                                onPress={handleSaveToGallery}
                                style={styles.btn}
                            >
                                <Feather
                                    name="download"
                                    size={24}
                                    color="#eee"
                                />
                            </Pressable>
                            <TextDefault style={styles.btnText}>
                                Salvar na galeria
                            </TextDefault>
                        </View>
                    </View>
                </View>

                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#8065ef" />
                    </View>
                )}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718",
    },
    content: {
        flex: 1,
        width: "100%",
        marginTop: 124,
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 16,
        marginBottom: 100,
    },
    previewWrapper: {
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "rgba(0,0,0,0.8)",
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        shadowOpacity: 0.8,
    },
    statusBarBg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        zIndex: 10,
    },
    backButton: {
        position: "absolute",
        left: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
    },
    colorRow: {
        width: "100%",
        gap: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "nowrap",
    },
    section: {
        width: "100%",
    },
    colorGrid: {
        marginTop: 8,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        gap: 12,
        flexWrap: "nowrap",
        paddingHorizontal: 16,
    },
    colorSwatch: {
        height: 32,
        aspectRatio: 1,
        borderRadius: 8,
    },
    btn: {
        backgroundColor: "#262829",
        borderWidth: 1,
        borderColor: "#36383A",
        height: 48,
        width: 48,
        aspectRatio: 1,
        borderRadius: 999,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    btnText: {
        color: "#eee",
        fontSize: 10,
        marginTop: 4,
        textAlign: "center",
        width: "100%",
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFill,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 999,
    },
});
