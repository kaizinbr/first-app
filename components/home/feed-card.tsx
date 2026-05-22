import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { EnrichedMarkdownText } from "react-native-enriched-markdown";
import { truncateMarkdown } from "@/lib/util/truncate";

import TextDefault from "@/components/core/text-core";
import { useRouter, Href, Link } from "expo-router";
import api, { apiAuth, apiAuthDELETE } from "@/lib/api";
import { Image } from "expo-image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { displayPastRelativeTime, getPastRelativeTime } from "@/lib/util/time";
import { AlbumCard } from "@/components/home/album-section";
import { ReviewWithAlbum, SpotifyAlbum } from "@/lib/types";

import {
    Flag,
    ForbiddenCircle,
    MenuDots,
    Pen,
    TrashBinTrash,
    User,
    Vinyl,
} from "@solar-icons/react-native/Bold";
import {
    ChatRound,
    ChatSquare,
    Share,
} from "@solar-icons/react-native/Outline";

import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
    useBottomSheetModal,
} from "@gorhom/bottom-sheet";

import ConfirmModal from "@/components/core/confirm-modal";
import { ShareLargeBtn, ShareSmBtn } from "@/components/core/share-btn";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LikeButton } from "@/components/reviews/like-btn";

const MAX_PREVIEW_CHARS = 500;

export default function FeedCard({
    review,
    onRefresh,
}: {
    review: ReviewWithAlbum;
    onRefresh: () => void;
}) {
    const router = useRouter();

    const insets = useSafeAreaInsets();

    const [content, setContent] = useState<{
        jsonContent: any;
        html: string;
    } | null>(null);

    const [itsMine, setItsMine] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const previewContent = review.review
        ? truncateMarkdown(review.review, MAX_PREVIEW_CHARS)
        : null;

    const isTruncated = review.review
        ? review.review.length > MAX_PREVIEW_CHARS
        : false;

    useEffect(() => {
        const fetchContent = async () => {
            if (!review.shorten) {
                // console.error("Review shorten is undefined");
                return;
            }

            if (
                !Array.isArray(review.content.content) ||
                review.content.content.length === 0 ||
                !Array.isArray(review.content.content[0].content) ||
                review.content.content[0].content.length === 0 ||
                review.content.content[0].content[0].text === ""
            ) {
                // console.warn("Review content is empty");
                return;
            }

            try {
                const response = await api.get(`/reviews/${review.id}/content`);
                setContent(response.data);
                // console.log("Content fetched successfully:", content.html);
            } catch (error) {
                console.error("Error fetching content:", error);
            }
        };
        const checkOwnership = async () => {
            try {
                const myProfile = await apiAuth("/me");
                setItsMine(review.Profile.id === myProfile.id);
            } catch (error) {
                console.error("Error checking review ownership:", error);
            }
        };

        fetchContent();

        checkOwnership();
    }, []);

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["50%", "85%", "100%"], []);

    const openSheet = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

    const { dismiss } = useBottomSheetModal();

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await apiAuthDELETE(`/reviews/${review.id}`, {
                method: "DELETE",
            });
            onRefresh();
            setIsLoading(false);
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    return (
        <>
            <Pressable
                onPress={() => router.push(`/review/${review.id}`)}
                style={({ pressed }) => [
                    styles.main,
                    pressed && styles.mainPressed,
                ]}
            >
                <View style={styles.card}>
                    <Image
                        source={{ uri: review.Profile.avatar_url! }}
                        style={styles.cardImage}
                    />
                    {review.album ? (
                        <View style={styles.cardContent}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    // backgroundColor: "blue",
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        maxWidth: "90%",
                                        alignItems: "flex-end",
                                        gap: 6,
                                        // backgroundColor: "red",
                                    }}
                                >
                                    <TextDefault
                                        numberOfLines={1}
                                        style={[
                                            styles.cardTitle,
                                            { maxWidth: "80%", flexShrink: 1 },
                                        ]}
                                    >
                                        {review.Profile.name}
                                    </TextDefault>
                                    <TextDefault
                                        style={{ color: "#777", fontSize: 12 }}
                                    >
                                        ·{" "}
                                        {getPastRelativeTime(
                                            new Date(review.created_at),
                                            new Date(),
                                        )}
                                    </TextDefault>
                                </View>
                                <Pressable
                                    onPress={(e) => {
                                        // e.stopPropagation();
                                        openSheet();
                                    }}
                                >
                                    <MenuDots color="#aaa" size={20} />
                                </Pressable>
                            </View>
                            {content ? (
                                <>
                                    <EnrichedMarkdownText
                                        markdown={
                                            previewContent ? previewContent : ""
                                        }
                                        markdownStyle={{
                                            paragraph: {
                                                color: "#fff",
                                                fontSize: 14,
                                                marginTop: 4,
                                                lineHeight: 20,
                                                fontFamily: "Walsheim",
                                                fontWeight: "400",
                                            },
                                            h1: {
                                                color: "#fff",
                                                fontSize: 18,
                                                fontWeight: "bold",
                                                lineHeight: 24,
                                                marginTop: 8,
                                            },
                                            h2: {
                                                color: "#fff",
                                                fontSize: 16,
                                                fontWeight: "bold",
                                                marginTop: 4,
                                                lineHeight: 20,
                                            },
                                        }}
                                    />
                                    {isTruncated && (
                                        <TextDefault style={styles.readMore}>
                                            ler mais
                                        </TextDefault>
                                    )}
                                </>
                            ) : null}

                            <AlbumCard
                                image={review.album.images[0].url}
                                value={
                                    review.total
                                        ? `${Number(review.total).toFixed(1)}/100`
                                        : "0/100"
                                }
                                subtitle={review.ratings.length}
                                review={review}
                            />
                            <View style={styles.buttonSection}>
                                <LikeButton
                                    ratingId={review.id}
                                    initialCount={review.likesCount} // vem da query pública
                                    size="md"
                                />
                                <Pressable
                                    onPress={() =>
                                        router.push(
                                            `/review/${review.id}#comments`,
                                        )
                                    }
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 4,
                                    }}
                                >
                                    <ChatSquare size={20} color="#888" />
                                    <TextDefault style={styles.extraInfo}>
                                        0
                                    </TextDefault>
                                </Pressable>

                                <ShareSmBtn
                                    url={`https://whistle.kaizin.work/r/${review.shorten}`}
                                />
                            </View>
                        </View>
                    ) : null}
                </View>
            </Pressable>

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
                                    <TextDefault style={styles.optText}>
                                        Excluir
                                    </TextDefault>
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
                                                "/(app)/create/review/tracks/[id]",
                                            params: { id: review.album_id },
                                        });
                                        dismiss();
                                    }}
                                >
                                    <Pen size={24} color="#eee" />
                                    <TextDefault style={styles.optText}>
                                        Editar
                                    </TextDefault>
                                </Pressable>
                            </>
                        )}
                        <ShareLargeBtn
                            type="review"
                            url={`https://whistle.kaizin.work/r/${review.shorten}`}
                            dismiss={dismiss}
                        />
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
                            <TextDefault style={styles.optText}>
                                Denunciar
                            </TextDefault>
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
                                    params: { id: review.album_id },
                                });
                                dismiss();
                            }}
                        >
                            <Vinyl size={24} color="#eee" />
                            <TextDefault style={styles.optText}>
                                Ver álbum
                            </TextDefault>
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
                                        username: review.Profile.username,
                                    },
                                });
                                dismiss();
                            }}
                        >
                            <User size={24} color="#eee" />
                            <TextDefault style={styles.optText}>
                                Ver usuário
                            </TextDefault>
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
                            <TextDefault style={styles.optText}>
                                Bloquear usuário
                            </TextDefault>
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
        </>
    );
}

const styles = StyleSheet.create({
    main: {
        width: "100%",
        backgroundColor: "transparent",
        borderRadius: 8,
    },
    mainPressed: {
        backgroundColor: "#1e1e1e",
    },
    card: {
        width: "100%",
        backgroundColor: "transparent",
        color: "#eee",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        borderRadius: 8,
        flexDirection: "row",
        gap: 8,
    },
    cardImage: {
        width: 40,
        height: 40,
        backgroundColor: "#bbb",
        borderRadius: 40 * 0.306,
        marginBottom: 8,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontWeight: 500,
        color: "#eee",
        marginTop: 4,
        fontSize: 14,
        // wordWrap: "break-word",
    },
    albumSection: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 12,
        color: "#eee",
        padding: 12,
        backgroundColor: "#1e1e1e",
        borderRadius: 8,
        borderColor: "#333",
        borderWidth: 0.5,
    },
    albumSectionValue: {
        fontWeight: 900,
        color: "#eee",
        fontSize: 20,
    },
    albumSectionText: {
        color: "#eee",
        fontSize: 12,
        marginTop: 6,
    },
    cardDate: {
        marginTop: 8,
        color: "#aaa",
        fontSize: 12,
    },
    readMore: {
        marginTop: 8,
        color: "#8065ef",
        fontSize: 14,
        fontWeight: "bold",
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
    buttonSection: {
        marginTop: 4,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
});
