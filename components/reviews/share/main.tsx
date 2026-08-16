import TextDefault from "@/components/core/text-core";
import ReviewCard from "@/components/reviews/share/reviewcard"; // ajuste o path conforme seu projeto
import { Album, Palette, Review } from "@/lib/types";
import Feather from "@expo/vector-icons/Feather";
import { AltArrowLeft } from "@/lib/solar-icons/Linear";
import { LinkMinimalistic2, SquareShareLine } from "@/lib/solar-icons/Outline";

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

import {
    getPalette,
    getColor,
    ColorThiefColorData,
} from "expo-color-thief-native";

import {
    selectBackgroundColor,
    selectGradientBackgroundColor,
    selectBackgroundGradient,
} from "@/lib/util/selectRightColor";

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
    palette,
}: {
    reviewData: Review;
    albumData: Album;
    palette: ColorThiefColorData[];
}) {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [colorOne, setColorOne] = useState(
        selectBackgroundColor(palette).background,
    );
    const [colorTwo, setColorTwo] = useState(
        selectBackgroundColor(palette).background,
    );
    const [isLoading, setIsLoading] = useState(false);
    const [colorsA, setColors] = useState<any>(null);

    // --- LÓGICA DE INFORMAÇÃO EXTRA ---
    const hasComment =
        !!reviewData.review && reviewData.review.trim().length > 0;

    const favoriteTracks =
        albumData.tracks?.items?.filter((track) =>
            reviewData.ratings?.some(
                (rating) => rating.id === track.id && rating.favorite,
            ),
        ) || [];
    const hasFavorites = favoriteTracks.length > 0;

    const [extraType, setExtraType] = useState<"comment" | "favorite" | null>(
        null,
    );
    const [selectedTrackName, setSelectedTrackName] = useState<string | null>(
        hasFavorites ? favoriteTracks[0].name : null,
    );

    const toggleExtraType = (type: "comment" | "favorite") => {
        setExtraType((prev) => (prev === type ? null : type));
    };

    const extraData =
        extraType === "comment" ? reviewData.review : selectedTrackName;

    const offscreenRef = useRef<View>(null);

    const captureCard = async (): Promise<string> => {
        return captureRef(offscreenRef, {
            format: "png",
            quality: 1,
            result: "tmpfile",
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
        const url =
            (reviewData as any).shareUrl ||
            (reviewData as any).url ||
            `https://whistle.kaizin.work/${reviewData.shorten as any}`;
        try {
            await Clipboard.setStringAsync(url);
        } catch (e) {
            console.error("Erro ao copiar link:", e);
        }
    };

    const textToCopy = `Avaliação de ${reviewData.Profile.name} 
    
${albumData.name} — ${albumData.artists
        .map((artist) => artist.name)
        .join(", ")} — ${reviewData.total}/100

${reviewData.ratings
    .map((rating: any) => {
        const track = albumData.tracks?.items?.find(
            (track) => track.id === rating.id,
        );
        return `${track?.track_number}. ${track?.name || "Unknown Track"}: ${rating.value}/100 ${rating.favorite ? "✨" : ""}`;
    })
    .join("\n")}
    
Comentário: ${reviewData.review}`;

    const handleCopyText = async () => {
        try {
            await Clipboard.setStringAsync(textToCopy);
        } catch (e) {
            console.error("Erro ao copiar texto:", e);
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
                } catch (error) {
                    console.error("Erro ao buscar cores da imagem:", error);
                }
            }
        };
        fetchColors();
    }, [albumData]);

    return (
        <>
            {/* Card offscreen em resolução full */}
            <View
                ref={offscreenRef}
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
                    extraType={extraType}
                    extraData={extraData}
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
                    <View style={styles.previewWrapper}>
                        <ReviewCard
                            reviewData={reviewData}
                            albumData={albumData}
                            colorOne={colorOne}
                            colorTwo={colorTwo}
                            width={312}
                            extraType={extraType}
                            extraData={extraData}
                        />
                    </View>

                    <View style={styles.colorRow}>
                        {colorsA && (
                            <View style={styles.colorGrid}>
                                {colorsA.map((colors: { hex: string }) => (
                                    <Pressable
                                        key={colors.hex}
                                        style={[
                                            styles.colorSwatch,
                                            { backgroundColor: colors.hex },
                                        ]}
                                        onPress={() => setColorOne(colors.hex)}
                                    />
                                ))}
                            </View>
                        )}
                    </View>

                    {(hasComment || hasFavorites) && (
                        <View
                            style={{
                                marginTop: 16,
                                width: "100%",
                                justifyContent: "center",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 12,
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    paddingHorizontal: 16,
                                }}
                            >
                                {hasComment && (
                                    <Pressable
                                        style={[
                                            styles.pillBtn,
                                            extraType === "comment" &&
                                                styles.pillBtnActive,
                                        ]}
                                        onPress={() =>
                                            toggleExtraType("comment")
                                        }
                                    >
                                        <TextDefault
                                            style={[
                                                styles.pillText,
                                                extraType === "comment" &&
                                                    styles.pillTextActive,
                                            ]}
                                        >
                                            Mostrar comentário
                                        </TextDefault>
                                    </Pressable>
                                )}

                                {hasFavorites && (
                                    <Pressable
                                        style={[
                                            styles.pillBtn,
                                            extraType === "favorite" &&
                                                styles.pillBtnActive,
                                        ]}
                                        onPress={() =>
                                            toggleExtraType("favorite")
                                        }
                                    >
                                        <TextDefault
                                            style={[
                                                styles.pillText,
                                                extraType === "favorite" &&
                                                    styles.pillTextActive,
                                            ]}
                                        >
                                            Música Favorita
                                        </TextDefault>
                                    </Pressable>
                                )}
                            </View>

                            {extraType === "favorite" &&
                                favoriteTracks.length > 1 && (
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        style={{ marginTop: 12 }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                gap: 8,
                                                paddingHorizontal: 16,
                                            }}
                                        >
                                            {favoriteTracks.map((track) => (
                                                <Pressable
                                                    key={track.id}
                                                    style={[
                                                        styles.trackPill,
                                                        selectedTrackName ===
                                                            track.name &&
                                                            styles.trackPillActive,
                                                    ]}
                                                    onPress={() =>
                                                        setSelectedTrackName(
                                                            track.name,
                                                        )
                                                    }
                                                >
                                                    <TextDefault
                                                        style={[
                                                            styles.trackPillText,
                                                            selectedTrackName ===
                                                                track.name &&
                                                                styles.trackPillTextActive,
                                                        ]}
                                                    >
                                                        {track.name}
                                                    </TextDefault>
                                                </Pressable>
                                            ))}
                                        </View>
                                    </ScrollView>
                                )}
                        </View>
                    )}

                    <View
                        style={{
                            flexDirection: "row",
                            gap: 8,
                            marginTop: 16,
                        }}
                    >
                        <View style={{ alignItems: "center", width: 48 }}>
                            <Pressable
                                onPress={handleCopyLink}
                                style={styles.btn}
                            >
                                <LinkMinimalistic2 size={24} color="#eee" />
                            </Pressable>
                            <TextDefault style={styles.btnText}>
                                Link
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
                                Salvar
                            </TextDefault>
                        </View>
                    </View>

                    <View
                        style={{
                            marginTop: 24,
                            width: "100%",
                            paddingHorizontal: 16,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                width: "100%",
                                paddingHorizontal: 16,
                                backgroundColor: "#262829",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: "#333",
                                paddingVertical: 12,
                            }}
                        >
                            <TextDefault
                                style={{
                                    color: "#eee",
                                    fontSize: 12,
                                    textAlign: "left",
                                }}
                            >
                                {textToCopy}
                            </TextDefault>
                        </View>
                        <Pressable
                            onPress={handleCopyText}
                            style={[
                                {
                                    marginTop: 8,
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    borderRadius: 16,
                                    backgroundColor: "#8065ef",
                                    borderWidth: 1,
                                    borderColor: "transparent",
                                },
                            ]}
                        >
                            <TextDefault
                                style={{
                                    color: "#fff",
                                    fontSize: 14,
                                }}
                            >
                                Copiar texto
                            </TextDefault>
                        </Pressable>
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
        marginTop: 100,
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
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#333",
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
    pillBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#2A2A2A",
        borderWidth: 1,
        borderColor: "transparent",
    },
    pillBtnActive: {
        backgroundColor: "#8065ef",
        borderColor: "#8065ef",
    },
    pillText: { color: "#989898", fontSize: 14 },
    pillTextActive: { color: "#eee" },

    // Pílulas das Músicas
    trackPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: "#1c1c1c",
        borderWidth: 1,
        borderColor: "#333",
    },
    trackPillActive: { borderColor: "#eee", backgroundColor: "#eee" },
    trackPillText: { color: "#989898", fontSize: 12 },
    trackPillTextActive: { color: "#161718", fontWeight: "bold" },
});
