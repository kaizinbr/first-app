import { EnrichedMarkdownText } from "react-native-enriched-markdown";
import {
    Linking,
    StyleSheet,
    View,
    Pressable,
    ActivityIndicator,
} from "react-native";

import { authClient } from "@/lib/auth-client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TextDefault from "@/components/core/text-core";
import { useRouter, Href, Link } from "expo-router";

import { apiAuth, apiAuthDELETE } from "@/lib/api";
import { Image } from "expo-image";

import { Comment } from "@/lib/types";
import { displayPastRelativeTime, getPastRelativeTime } from "@/lib/util/time";

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

import { LikeCommentButton } from "@/components/reviews/like-btn";

const markdown = `
**Teste negrito** *italico* e normal aaaaa ***e os dois***
`;

export default function CommentCard({
    commentData,
    refreshComments,
}: {
    commentData: Comment;
    refreshComments: () => void;
}) {
    const { data: session, isPending } = authClient.useSession();
    console.log("Rendering CommentCard with data:", session);
    const router = useRouter();

    const insets = useSafeAreaInsets();

    const [itsMine, setItsMine] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["50%", "85%", "100%"], []);

    const openSheet = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

    const { dismiss } = useBottomSheetModal();

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await apiAuthDELETE(`/comments/${commentData.id}`);
            refreshComments();
            setIsLoading(false);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };
    return (
        <>
            <Pressable
                // onPress={() => router.push(`/review/${commentData.id}`)}
                style={({ pressed }) => [
                    styles.main,
                    pressed && styles.mainPressed,
                ]}
                onLongPress={() => {
                    openSheet();
                }}
            >
                <View style={styles.card}>
                    <Image
                        source={{ uri: commentData.Profile.avatar_url! }}
                        style={styles.cardImage}
                    />
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
                                    {commentData.Profile.name}
                                </TextDefault>
                                <TextDefault
                                    style={{ color: "#777", fontSize: 12 }}
                                >
                                    ·{" "}
                                    {getPastRelativeTime(
                                        new Date(commentData.created_at),
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
                        <View>
                            <EnrichedMarkdownText
                                markdown={commentData.body}
                                onLinkPress={({ url }) => router.push({
                                    pathname: "/(app)/(tabs)/(drafts)/user/[username]",
                                    params: { username: url.replace("@", "") },
                                })}
                                
                                containerStyle={{
                                    flex: 1,
                                    color: "#fff",
                                    backgroundColor: "transparent",
                                    padding: 0,
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                }}
                                markdownStyle={{
                                    strong: { color: "#fff" },
                                    em: { color: "#aaa" },
                                    link: {
                                        color: "#8065ef",
                                        underline: false,
                                    },
                                    paragraph: {
                                        marginBottom: 0,
                                        color: "#fff",
                                        fontSize: 14,
                                        marginTop: 4,
                                        lineHeight: 20,
                                        fontFamily: "Walsheim",
                                        fontWeight: "400",
                                    },
                                }}
                            />
                        </View>

                        <View style={styles.buttonSection}>
                            <LikeCommentButton
                                commentId={commentData.id}
                                initialCount={commentData._count.CommentLike} // vem da query pública
                                size="md"
                            />
                            {/* <Pressable
                                onPress={() =>
                                    router.push(
                                        `/review/${commentData.id}#comments`,
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
                            </Pressable> */}

                            <ShareSmBtn
                                url={`https://whistle.kaizin.work/r/${commentData.id}`}
                            />
                        </View>
                    </View>
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
                        {session?.user.id === commentData.authorId && (
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
                                {/* <Pressable
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
                                            params: { id: commentData.album_id },
                                        });
                                        dismiss();
                                    }}
                                >
                                    <Pen size={24} color="#eee" />
                                    <TextDefault style={styles.optText}>
                                        Editar
                                    </TextDefault>
                                </Pressable> */}
                            </>
                        )}
                        {/* <ShareLargeBtn
                            type="review"
                            url={`https://whistle.kaizin.work/r/${commentData.shorten}`}
                            dismiss={dismiss}
                        /> */}
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
                        {/* <Pressable
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
                                    params: { id: commentData.album_id },
                                });
                                dismiss();
                            }}
                        >
                            <Vinyl size={24} color="#eee" />
                            <TextDefault style={styles.optText}>
                                Ver álbum
                            </TextDefault>
                        </Pressable> */}
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
                                        username: commentData.Profile.username,
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
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718",
        padding: 16,
    },
    text: {
        flex: 1,
        fontSize: 15,
        color: "#fff",
        maxHeight: 100, // limita a altura máxima
        minHeight: 28,
    },
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
        marginTop: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
});
