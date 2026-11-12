import TextDefault from "@/components/core/text-core";
import api from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Notification, ReviewWithAlbum } from "@/lib/types";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Pressable,
    StyleSheet,
    View
} from "react-native";


import ConfirmModal from "@/components/core/confirm-modal";


import { ChatRoundLineIcon } from '@solar-icons/react-native/bold/chat-round-line'
import { HeartsIcon } from '@solar-icons/react-native/bold/hearts'
import { SirenRoundedIcon } from '@solar-icons/react-native/bold/siren-rounded'

import { getShortPastRelativeTime } from "@/lib/util/time";

const MAX_PREVIEW_CHARS = 500;

export default function NotsCard({
    nots,
    onRefresh,
}: {
    nots: Notification;
    onRefresh: () => void;
}) {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    // console.log("DraftCard renderizado com draft:", draft);

    const [loading, setLoading] = useState(true);
    const [reviewData, setReviewData] = useState<ReviewWithAlbum | any>(null);

    useEffect(() => {
        const fecthAlbumData = async () => {
            setIsLoading(true);
            try {
                if (nots.ratingId && nots.type !== "follow") {
                    const response = await api.get(`/reviews/${nots.ratingId}`);
                    setReviewData(response.data[0]);
                    // console.log("Review data fetched successfully:", reviewData);

                    // if (response.data.albumId) {
                    //     const albumResponse = await api.get(`/albums/${response.data.albumId}`);
                    //     setAlbumData(albumresponse.data);
                    //     console.log("Album data fetched successfully:", albumresponse.data);
                    // }
                    setLoading(false);
                }
                // console.log("Content fetched successfully:", content.html);
            } catch (error) {
                console.error("Error fetching content:", error);
                setLoading(false);
            }
        };

        fecthAlbumData();
    }, []);

    const setSeen = async () => {
        try {
            await api.post(`/notifications/${nots.id}/seen`);
            onRefresh();
        } catch (error) {
            console.error("Error setting notification as seen:", error);
        }
    };

    // menu

    const [isLoading, setIsLoading] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            // DraftStorage.remove(draft.albumId);
            setIsLoading(false);
            onRefresh();
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    return (
        <>
            {nots.type === "like" && (
                <Pressable
                    onPress={() => {
                        setSeen();
                        router.push({
                            pathname:
                                "/(app)/(tabs)/(notifications)/review/[id]",
                            params: { id: nots.ratingId as unknown as string },
                        });
                    }}
                    style={({ pressed }) => [
                        styles.main,
                        pressed && styles.mainPressed,
                        {
                            backgroundColor: nots.seen
                                ? "transparent"
                                : "#212223",
                        },
                    ]}
                >
                    <View style={styles.card}>
                        {reviewData ? (
                            <>
                                <View
                                    style={{
                                        height: 36,
                                        width: 36,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "#8065ef22",
                                        borderRadius: 36 * 0.306,
                                    }}
                                >
                                    <HeartsIcon size={24} color="#8065ef" />
                                </View>
                                <View style={styles.cardContent}>
                                    <TextDefault style={styles.cardTitle}>
                                        {nots
                                            .Profile_Notification_sender_idToProfile
                                            .name ||
                                            "Usuário não encontrado"}{" "}
                                        curtiu sua review de{" "}
                                        {reviewData.album?.name ||
                                            "Álbum não encontrado"}
                                    </TextDefault>
                                    {/* <TextDefault style={styles.cardText}>
                                    {Object.keys(draft.ratings).length} músicas
                                    · nota {draft.overallRating}
                                </TextDefault> */}

                                    <TextDefault style={styles.cardMeta}>
                                        {getShortPastRelativeTime(
                                            new Date(nots.created_at),
                                            new Date(),
                                        )}
                                    </TextDefault>
                                </View>
                            </>
                        ) : (
                            <>
                                <View
                                    style={{
                                        height: 36,
                                        width: 36,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "#8065ef22",
                                        borderRadius: 36 * 0.306,
                                    }}
                                >
                                    <SirenRoundedIcon size={24} color="#8065ef" />
                                </View>
                                <View style={styles.cardContent}>
                                    <View
                                        style={{
                                            padding: 8,
                                            backgroundColor: "#202020",
                                            borderRadius: 4,
                                        }}
                                    />
                                    <View
                                        style={{
                                            marginTop: 8,
                                            padding: 6,
                                            backgroundColor: "#202020",
                                            borderRadius: 4,
                                        }}
                                    />
                                </View>
                            </>
                        )}
                    </View>
                </Pressable>
            )}
            {nots.type === "follow" && (
                <Pressable
                    onPress={() => {
                        setSeen();
                        router.push({
                            pathname:
                                "/(app)/(tabs)/(notifications)/user/[username]",
                            params: {
                                username:
                                    nots.Profile_Notification_sender_idToProfile
                                        .username,
                            },
                        });
                    }}
                    style={({ pressed }) => [
                        styles.main,
                        pressed && styles.mainPressed,
                        {
                            backgroundColor: nots.seen
                                ? "transparent"
                                : "#212223",
                        },
                    ]}
                >
                    <View style={styles.card}>
                        <Image
                            source={{
                                uri: nots
                                    .Profile_Notification_sender_idToProfile
                                    .avatar_url,
                            }}
                            style={styles.cardImage}
                        />
                        <View style={styles.cardContent}>
                            <TextDefault style={styles.cardTitle}>
                                {nots.Profile_Notification_sender_idToProfile
                                    .name || "Usuário não encontrado"}{" "}
                                seguiu você
                            </TextDefault>

                            <TextDefault style={styles.cardMeta}>
                                {getShortPastRelativeTime(
                                    new Date(nots.created_at),
                                    new Date(),
                                )}
                            </TextDefault>
                        </View>
                    </View>
                </Pressable>
            )}

            {nots.type === "comment" && (
                <Pressable
                    onPress={() => {
                        setSeen();
                        router.push({
                            pathname:
                                "/(app)/(tabs)/(notifications)/review/[id]",
                            params: { id: nots.ratingId as unknown as string },
                        });
                    }}
                    style={({ pressed }) => [
                        styles.main,
                        pressed && styles.mainPressed,
                        {
                            backgroundColor: nots.seen
                                ? "transparent"
                                : "#212223",
                        },
                    ]}
                >
                    <View style={styles.card}>
                        {reviewData ? (
                            <>
                                <View
                                    style={{
                                        height: 36,
                                        width: 36,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "#8065ef22",
                                        borderRadius: 36 * 0.306,
                                    }}
                                >
                                    <ChatRoundLineIcon size={24} color="#8065ef" />
                                </View>
                                <View style={styles.cardContent}>
                                    <TextDefault style={styles.cardTitle}>
                                        {nots
                                            .Profile_Notification_sender_idToProfile
                                            .name ||
                                            "Usuário não encontrado"}{" "}
                                        comentou em sua review de{" "}
                                        {reviewData.album?.name ||
                                            "Álbum não encontrado"}
                                    </TextDefault>

                                    <TextDefault style={styles.cardMeta}>
                                        {getShortPastRelativeTime(
                                            new Date(nots.created_at),
                                            new Date(),
                                        )}
                                    </TextDefault>
                                </View>
                            </>
                        ) : (
                            <>
                                <View
                                    style={{
                                        height: 36,
                                        width: 36,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "#8065ef22",
                                        borderRadius: 36 * 0.306,
                                    }}
                                >
                                    <SirenRoundedIcon size={24} color="#8065ef" />
                                </View>
                                <View style={styles.cardContent}>
                                    <View
                                        style={{
                                            padding: 8,
                                            backgroundColor: "#202020",
                                            borderRadius: 4,
                                        }}
                                    />
                                    <View
                                        style={{
                                            marginTop: 8,
                                            padding: 6,
                                            backgroundColor: "#202020",
                                            borderRadius: 4,
                                        }}
                                    />
                                </View>
                            </>
                        )}
                    </View>
                </Pressable>
            )}

            {/* {isLoading && (
                <Pressable
                    onPress={() => {
                        setSeen();
                        router.push({
                            pathname:
                                "/(app)/(tabs)/(notifications)/review/[id]",
                            params: { id: nots.ratingId as unknown as string },
                        });
                    }}
                    style={({ pressed }) => [
                        styles.main,
                        pressed && styles.mainPressed,
                        {
                            backgroundColor: nots.seen
                                ? "transparent"
                                : "#212223",
                        },
                    ]}
                >
                    <View style={styles.card}>
                        {reviewData ? (
                            <>
                                <View
                                    style={{
                                        height: 36,
                                        width: 36,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "#8065ef22",
                                        borderRadius: 36 * 0.306,
                                    }}
                                >
                                    <SirenRounded size={24} color="#8065ef" />
                                </View>
                                <View style={styles.cardContent}>
                                    <View style={{
                                            padding: 8,
                                            backgroundColor: "#202020",
                                            borderRadius: 4,
                                    }} />
                                    <View style={{
                                            marginTop: 8,
                                            padding: 6,
                                            backgroundColor: "#202020",
                                            borderRadius: 4,
                                    }} />
                                </View>
                            </>
                        ) : null}
                    </View>
                </Pressable>
            )} */}
            {/* {nots.type === "like" && (
                <Pressable
                    // onPress={() =>
                    //     router.push({
                    //         pathname: "/(app)/create/review/tracks/[id]",
                    //         params: { id: draft.albumId },
                    //     })
                    // }
                    style={({ pressed }) => [
                        styles.main,
                        pressed && styles.mainPressed,
                    ]}
                >
                    <View style={styles.card}>
                        {reviewData ? (
                            <>
                                <Image
                                    source={{
                                        uri: nots
                                            .Profile_Notification_sender_idToProfile
                                            .avatar_url,
                                    }}
                                    style={styles.cardImage}
                                />
                                <View style={styles.cardContent}>
                                    <TextDefault style={styles.cardTitle}>
                                        {nots
                                            .Profile_Notification_sender_idToProfile
                                            .name ||
                                            "Usuário não encontrado"}{" "}
                                        curtiu sua review de{" "}
                                        {reviewData.album?.name ||
                                            "Álbum não encontrado"}
                                    </TextDefault>
                                    {/* <TextDefault style={styles.cardText}>
                                    {Object.keys(draft.ratings).length} músicas
                                    · nota {draft.overallRating}
                                </TextDefault> 

                                    <TextDefault style={styles.cardMeta}>
                                        {new Date(
                                            nots.created_at,
                                        ).toLocaleString("pt-BR", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </TextDefault>
                                </View>
                            </>
                        ) : null}
                    </View>
                </Pressable>
            )} */}

            <ConfirmModal
                visible={showDeleteModal}
                title="Apagar rascunho?"
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
    main: {
        width: "100%",
        backgroundColor: "transparent",
    },
    mainPressed: {
        backgroundColor: "#1e1e1e",
    },
    card: {
        width: "100%",
        color: "#eee",
        flexDirection: "row",
        gap: 8,
        // backgroundColor: "#212223",
        padding: 16,
    },
    cardImage: {
        width: 36,
        height: 36,
        backgroundColor: "#bbb",
        borderRadius: 36 * 0.306,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontWeight: 500,
        color: "#eee",
    },
    cardText: {
        // fontWeight: 500,
        color: "#eee",
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

    cardMeta: {
        color: "#777",
        fontSize: 13,
    },
});
