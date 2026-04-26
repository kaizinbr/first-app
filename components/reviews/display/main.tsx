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
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import TextDefault from "@/components/core/text-core";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}

export default function ReviewAlbumScreen({
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

    const HEADER_MAX_HEIGHT = 264;
    const HEADER_MIN_HEIGHT = insets.top + 50;
    const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

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

    const topBarStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [SCROLL_DISTANCE - 40, SCROLL_DISTANCE], // Começa a aparecer 40px antes de bater no topo
            [0, 1],
            Extrapolation.CLAMP,
        );
        return { opacity };
    });

    const headerContentStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, SCROLL_DISTANCE / 1.5], // Some um pouco antes da metade do caminho
            [1, 0],
            Extrapolation.CLAMP,
        );
        return { opacity };
    });

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["50%", "85%", "100%"], []);

    const openSheet = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

    const { dismiss } = useBottomSheetModal();

    const [itsMine, setItsMine] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkOwnership = async () => {
            try {
                const myProfile = await apiAuth("/me");
                setItsMine(reviewData.Profile.id === myProfile.id);
                console.log(
                    "Review ownership:",
                    reviewData.Profile.id,
                    myProfile.id,
                    reviewData.Profile.id === myProfile.id,
                );
            } catch (error) {
                console.error("Error checking review ownership:", error);
            }
        };
        checkOwnership();
        // setItsMine(reviewData.user.id === myProfile.id);
    }, [reviewData]);

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await apiAuthDELETE(`/reviews/${reviewData.id}`, {
                method: "DELETE",
            });
            router.back();
            setIsLoading(false);
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

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
                <TextDefault style={styles.fixedTitle} numberOfLines={1}>
                    {albumData.name}
                </TextDefault>
                
                            <LinearGradient
                                colors={[
                                    `rgba(${hexToRgb(selectRightColor(colors))}, 0)`,
                                    darkenColor(selectRightColor(colors), 1.2),
                                ]}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: HEADER_MIN_HEIGHT,
                                    zIndex: -1,
                                }}
                            />
            </Animated.View>

            {/* BOTÃO VOLTAR */}
            <Pressable
                onPress={() => router.back()}
                style={[styles.backButton, { top: insets.top + 4 }]}
            >
                <AltArrowLeft size={32} color="#eee" />
            </Pressable>

            <Pressable
                style={[styles.dotsBtn, { top: insets.top + 4 }]}
                onPress={openSheet}
            >
                <MenuDots
                    // albumData={albumData}
                    size={26}
                    color="#eee"
                    style={{ transform: [{ rotate: "90deg" }] }}
                />
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
                {reviewData.review.length > 0 && (
                    <ReviewContent review={reviewData} />
                )}
                <Tracklist
                    review={reviewData}
                    albumTracks={albumData.tracks.items}
                />
                <AlbumExtraData data={albumData} />
                <View style={{ height: 100 }} />
            </Animated.ScrollView>
            <BottomSheetModal
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                enablePanDownToClose
                topInset={insets.top}
                // containerStyle={{ zIndex: 1000 }}
                backgroundStyle={{ backgroundColor: "#161718" }}
                handleIndicatorStyle={{ backgroundColor: "#555" }}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop
                        {...props}
                        disappearsOnIndex={-1}
                        appearsOnIndex={0}
                    />
                )}
            >
                <BottomSheetView>
                    <View style={styles.sheetView}>
                        {itsMine && (
                            <>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.optBtn,
                                        {
                                            backgroundColor: pressed
                                                ? "rgba(255, 255, 255, 0.05)"
                                                : "transparent",
                                        },
                                    ]}
                                    onPress={() => {
                                        dismiss();
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    <TrashBinTrash size={24} color="#eee" />
                                    <TextDefault style={styles.optText}>Excluir</TextDefault>
                                </Pressable>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.optBtn,
                                        {
                                            backgroundColor: pressed
                                                ? "rgba(255, 255, 255, 0.05)"
                                                : "transparent",
                                        },
                                    ]}
                                    onPress={() => {
                                        router.push({
                                            pathname:
                                                "/(app)/create/review/[id]",
                                            params: { id: reviewData.album_id },
                                        });
                                        dismiss();
                                    }}
                                >
                                    <Pen size={24} color="#eee" />
                                    <TextDefault style={styles.optText}>Editar</TextDefault>
                                </Pressable>
                            </>
                        )}
                        <ShareLargeBtn type="review" url={`https://whistle.kaizin.work/r/${reviewData.shorten}`} dismiss={dismiss} />
                        <Pressable
                            style={({ pressed }) => [
                                styles.optBtn,
                                {
                                    backgroundColor: pressed
                                        ? "rgba(255, 255, 255, 0.05)"
                                        : "transparent",
                                },
                            ]}
                            onPress={() => {}}
                        >
                            <Flag size={24} color="#eee" />
                            <TextDefault style={styles.optText}>Denunciar</TextDefault>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.optBtn,
                                {
                                    backgroundColor: pressed
                                        ? "rgba(255, 255, 255, 0.05)"
                                        : "transparent",
                                },
                            ]}
                            onPress={() => {
                                router.push({
                                    pathname: "/(app)/(tabs)/(home)/album/[id]",
                                    params: { id: reviewData.album_id },
                                });
                                dismiss();
                            }}
                        >
                            <Vinyl size={24} color="#eee" />
                            <TextDefault style={styles.optText}>Ver álbum</TextDefault>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.optBtn,
                                {
                                    backgroundColor: pressed
                                        ? "rgba(255, 255, 255, 0.05)"
                                        : "transparent",
                                },
                            ]}
                            onPress={() => {
                                router.push({
                                    pathname:
                                        "/(app)/(tabs)/(home)/user/[username]",
                                    params: {
                                        username: reviewData.Profile.username,
                                    },
                                });
                                dismiss();
                            }}
                        >
                            <User size={24} color="#eee" />
                            <TextDefault style={styles.optText}>Ver usuário</TextDefault>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.optBtn,
                                {
                                    backgroundColor: pressed
                                        ? "rgba(255, 255, 255, 0.05)"
                                        : "transparent",
                                },
                            ]}
                            onPress={() => {}}
                        >
                            <ForbiddenCircle size={24} color="#eee" />
                            <TextDefault style={styles.optText}>Bloquear usuário</TextDefault>
                        </Pressable>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
            <ConfirmModal
                visible={showDeleteModal}
                title="Apagar avaliação"
                message="Essa ação não pode ser desfeita."
                confirmLabel="Apagar"
                cancelLabel="Cancelar"
                confirmDestructive
                onConfirm={() => {
                    handleDelete();
                    setShowDeleteModal(false);
                }}
                onCancel={() => setShowDeleteModal(false)}
            />
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
