import TextDefault from "@/components/core/text-core";
import CommentCard from "@/components/reviews/display/comments/comment-card";
import { apiAuth, apiAuthDELETE } from "@/lib/api";
import { Comment, Review } from "@/lib/types";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function CommentsSection({
    refreshKey,
    reviewData,
    refreshComments,
}: {
    refreshKey: number;
    reviewData: Review;
    refreshComments: () => void;
}) {
    const router = useRouter();

    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [itsMine, setItsMine] = useState(false);
    const { dismiss } = useBottomSheetModal();

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            try {
                const coms = await apiAuth(`/reviews/${reviewData.id}/comment`);
                setComments(coms.comments);
            } catch (error) {
                console.error("Error checking review ownership:", error);
            }
            setIsLoading(false);
        };
        fetchComments();
    }, [reviewData.id, refreshKey]);

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
            <TextDefault
                style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 12,
                    paddingHorizontal: 16,
                }}
            >
                Comentários
            </TextDefault>
            {isLoading && (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator size="large" color="#8065ef" />
                </View>
            )}
            {comments.length === 0 ? (
                <TextDefault
                    style={{
                        color: "#aaa",
                        fontSize: 14,
                        paddingHorizontal: 16,
                    }}
                >
                    Seja o primeiro a comentar!
                </TextDefault>
            ) : (
                comments.map((comment) => (
                    <React.Fragment key={comment.id}>
                        <CommentCard
                            commentData={comment}
                            refreshComments={refreshComments}
                        />
                        <View
                            style={{
                                height: 0.5,
                                backgroundColor: "#333",
                                marginVertical: 0,
                                marginHorizontal: 16,
                            }}
                        />
                    </React.Fragment>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#161718",
        paddingVertical: 16,
    },
});
