import ConfirmModal from "@/components/core/confirm-modal";
import { ShareLargeBtn } from "@/components/core/share-btn";
import AlbumData, { AlbumExtraData } from "@/components/reviews/display/data";
import AlbumHeader from "@/components/reviews/display/header";
import ReviewContent from "@/components/reviews/display/review-content";
import ReviewScore from "@/components/reviews/display/score";
import Tracklist from "@/components/reviews/display/tracklist";
import { apiAuth, apiAuthDELETE } from "@/lib/api";
import { Album, Palette, Review } from "@/lib/types";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { darkenColor } from "@/lib/util/workWithColors";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
    useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import {
    Flag,
    ForbiddenCircle,
    MenuDots,
    Pen,
    Share,
    TrashBinTrash,
    User,
    Vinyl,
} from "@solar-icons/react-native/Bold";
import { AltArrowLeft } from "@solar-icons/react-native/Linear";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
    Image,
} from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

    const scrollY = useSharedValue(0);

    const [colorOne, setColorOne] = useState(colors.dominant);
    const [colorTwo, setColorTwo] = useState(colors.vibrant);

    const [isLoading, setIsLoading] = useState(false);

    const cardRef = useRef(null);
    const captureCard = async (): Promise<string> => {
        return await captureRef(cardRef, {
            format: "png",
            quality: 1,
            // Para story (9:16), garante que o output seja a resolução certa
            result: "tmpfile",
        });
    };

    // Abre o share sheet nativo — funciona pra Instagram, WhatsApp, etc.
    const handleShare = async () => {
        const uri = await captureCard();
        await Sharing.shareAsync(uri, {
            mimeType: "image/png",
            dialogTitle: "Compartilhar review",
        });
    };

    // Salva na galeria (caso queira dar essa opção separada)
    const handleSaveToGallery = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        console.log("Permission status:", status);
        if (status !== "granted") return;

        const uri = await captureCard();
        await MediaLibrary.saveToLibraryAsync(uri);
    };

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => router.back()}
                style={[styles.backButton, { top: insets.top + 4 }]}
            >
                <AltArrowLeft size={32} color="#eee" />
            </Pressable>

            <View
                style={{
                    flex: 1,
                    width: "100%",
                    marginTop: 96,
                    justifyContent: "flex-start",
                    alignItems: "center",
                }}
            >
                <View 
                        style={{
                            aspectRatio: "9/16",
                            width: "50%",
                            backgroundColor: colorOne,
                            borderRadius: 16,
                            overflow: "hidden",
                            shadowColor: "rgba(0,0,0,0.8)",
                            shadowOffset: { width: 0, height: 4 },
                            shadowRadius: 8,
                            shadowOpacity: 0.8,
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}>
                    <ViewShot
                        ref={cardRef}
                        options={{ format: "png", quality: 1 }}
                        style={{
                            aspectRatio: "9/16",
                            width: "100%",
                            backgroundColor: colorOne,
                        }}
                    >
                        <View
                            style={{
                                width: "100%",
                                height: "100%",
                                zIndex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <View
                                style={{
                                    width: "100%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "relative",
                                }}
                            >
                                <Image
                                    source={{ uri: reviewData.Profile.avatar_url }}
                                    style={{
                                        width: 18,
                                        aspectRatio: 1,
                                        marginTop: 16,
                                        borderRadius: 18 * 0.306,
                                        position: "absolute",
                                        top: -12,
                                        zIndex: 2,
                                    }}
                                    resizeMode="cover"
                                />
                                <Image
                                    source={{ uri: albumData.images[0].url }}
                                    style={{
                                        width: "50%",
                                        aspectRatio: 1,
                                        marginTop: 16,
                                        borderRadius: 6,
                                    }}
                                    resizeMode="cover"
                                />
                            </View>
                            <Text
                                style={{
                                    color: "#eee",
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    marginTop: 12,
                                }}
                            >
                                {Number(reviewData.total).toFixed(1)}/100
                            </Text>
                            <Text
                                style={{
                                    color: "#eee",
                                    fontSize: 7,
                                    fontWeight: 400,
                                    marginTop: 12,
                                }}
                            >
                                {reviewData.Profile.name} avaliou
                            </Text>
                            <Text
                                style={{
                                    color: "#eee",
                                    fontSize: 7,
                                    fontWeight: 700,
                                }}
                            >
                                {albumData.name}
                            </Text>
                            <Text
                                style={{
                                    color: "#989898",
                                    fontSize: 7,
                                    fontWeight: 400,
                                }}
                            >
                                {albumData.artists[0].name}
                            </Text>
                            <Text
                                style={{
                                    color: "#989898",
                                    fontSize: 7,
                                    fontWeight: 400,
                                    marginTop: 24,
                                }}
                            >
                                Veja mais em whistle.kaizin.work
                            </Text>
                        </View>
                        <LinearGradient
                            colors={[colorOne, "#000"]} // Troque pela cor dinâmica do álbum depois
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                        <LinearGradient
                            colors={[colorTwo, "#000"]} // Troque pela cor dinâmica do álbum depois
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
                        />
                        {/* Camada 2: Uma sombra que vem de baixo pra criar a "profundidade" do mesh */}
                        <LinearGradient
                            colors={["transparent", "rgba(0, 0, 0, 0.5)"]}
                            start={{ x: 0.5, y: 0.2 }}
                            end={{ x: 0.5, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                    </ViewShot>
                </View>

                <View
                    style={{
                        marginTop: 24,
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 12,
                    }}
                >
                    <Pressable
                        style={{
                            backgroundColor: colors.dominant,
                            height: 44,
                            width: 44,
                            borderRadius: 8,
                        }}
                        onPress={() => {
                            setColorOne(colors.dominant);
                        }}
                    />
                    <Pressable
                        style={{
                            backgroundColor: colors.vibrant,
                            height: 44,
                            width: 44,
                            borderRadius: 8,
                        }}
                        onPress={() => {
                            setColorOne(colors.vibrant);
                        }}
                    />
                    <Pressable
                        style={{
                            backgroundColor: colors.darkVibrant,
                            height: 44,
                            width: 44,
                            borderRadius: 8,
                        }}
                        onPress={() => {
                            setColorOne(colors.darkVibrant);
                        }}
                    />
                    <Pressable
                        style={{
                            backgroundColor: colors.lightVibrant,
                            height: 44,
                            width: 44,
                            borderRadius: 8,
                        }}
                        onPress={() => {
                            setColorOne(colors.lightVibrant);
                        }}
                    />
                    <Pressable
                        style={{
                            backgroundColor: colors.muted,
                            height: 44,
                            width: 44,
                            borderRadius: 8,
                        }}
                        onPress={() => {
                            setColorOne(colors.muted);
                        }}
                    />
                    <Pressable
                        style={{
                            backgroundColor: colors.darkMuted,
                            height: 44,
                            width: 44,
                            borderRadius: 8,
                        }}
                        onPress={() => {
                            setColorOne(colors.darkMuted);
                        }}
                    />
                    <Pressable
                        style={{
                            backgroundColor: colors.lightMuted,
                            height: 44,
                            width: 44,
                            borderRadius: 8,
                        }}
                        onPress={() => {
                            setColorOne(colors.lightMuted);
                        }}
                    />
                </View>
                <View
                    style={{
                        marginTop: 24,
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 12,
                    }}
                >
                    <Pressable
                        style={{
                            backgroundColor: colors.dominant,
                            height: 44,
                            width: 44,
                            borderRadius: 8,
                        }}
                        onPress={() => {
                            setColorTwo(colors.dominant);
                        }}
                    />
                    <Pressable
                        style={{
                            backgroundColor: colors.vibrant,
                            height: 44,
                            width: 44,
                            borderRadius: 8,
                        }}
                        onPress={() => {
                            setColorTwo(colors.vibrant);
                        }}
                    />
                    <Pressable
                        style={{
                            backgroundColor: colors.darkVibrant,
                            height: 44,
                            width: 44,
                            borderRadius: 8,
                        }}
                        onPress={() => {
                            setColorTwo(colors.darkVibrant);
                        }}
                    />
                    <Pressable
                        style={{
                            backgroundColor: colors.lightVibrant,
                            height: 44,
                            width: 44,
                            borderRadius: 8,
                        }}
                        onPress={() => {
                            setColorTwo(colors.lightVibrant);
                        }}
                    />
                    <Pressable
                        style={{
                            backgroundColor: colors.muted,
                            height: 44,
                            width: 44,
                            borderRadius: 8,
                        }}
                        onPress={() => {
                            setColorTwo(colors.muted);
                        }}
                    />
                    <Pressable
                        style={{
                            backgroundColor: colors.darkMuted,
                            height: 44,
                            width: 44,
                            borderRadius: 8,
                        }}
                        onPress={() => {
                            setColorTwo(colors.darkMuted);
                        }}
                    />
                    <Pressable
                        style={{
                            backgroundColor: colors.lightMuted,
                            height: 44,
                            width: 44,
                            borderRadius: 8,
                        }}
                        onPress={() => {
                            setColorTwo(colors.lightMuted);
                        }}
                    />
                </View>
                <Pressable onPress={handleShare} style={{ marginTop: 24 }}>
                    <Text
                        style={{
                            color: "#eee",
                            fontSize: 16,
                            fontWeight: "bold",
                        }}
                    >
                        Compartilhar
                    </Text>
                </Pressable>

                <Pressable
                    onPress={handleSaveToGallery}
                    style={{ marginTop: 24 }}
                >
                    <Text
                        style={{
                            color: "#eee",
                            fontSize: 16,
                            fontWeight: "bold",
                        }}
                    >
                        Salvar na Galeria
                    </Text>
                </Pressable>
            </View>

            {isLoading && (
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            zIndex: 999,
                        },
                    ]}
                >
                    <ActivityIndicator size="large" color="#8065ef" />
                </View>
            )}
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
    fixedTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        width: "65%",
        textAlign: "center",
    },
    backButton: {
        position: "absolute",
        left: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
        // backgroundColor: "rgba(255,255,255,0.05)",
    },

    dotsBtn: {
        position: "absolute",
        right: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "flex-end",
        // backgroundColor: "rgba(255,255,255,0.05)",
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
    sheetView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
    },
    optBtn: {
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: "transparent",
        padding: 12,
        width: "100%",
        borderRadius: 8,
    },
    optText: {
        color: "#eee",
        fontSize: 14,
        marginLeft: 12,
    },
    extraInfo: {
        color: "#777",
        fontSize: 14,
    },
});
