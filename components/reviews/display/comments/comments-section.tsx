import { KeyboardAvoidingView, Platform } from "react-native"
import ConfirmModal from "@/components/core/confirm-modal";
import { ShareLargeBtn } from "@/components/core/share-btn";
import AlbumData, { AlbumExtraData } from "@/components/reviews/display/data";
import AlbumHeader from "@/components/reviews/display/header";
import ReviewContent from "@/components/reviews/display/review-content";
import ReviewScore from "@/components/reviews/display/score";
import Tracklist from "@/components/reviews/display/tracklist";
import { apiAuth, apiAuthDELETE } from "@/lib/api";
import { Album, Palette, Review, Comment } from "@/lib/types";
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
import FixedHeader from "@/components/core/fixed-header";
import { LikeButton } from "@/components/reviews/like-btn";
import { CommentInput } from "@/components/reviews/display/comments/comment-input";
import CommentCard from "@/components/reviews/display/comments/comment-card";


export default function CommentsSection({
    refreshComments,
    reviewData,
}: {
    refreshComments: () => void;
    reviewData: Review;
}) {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [itsMine, setItsMine] = useState(false);
    const { dismiss } = useBottomSheetModal();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const coms = await apiAuth(`/reviews/${reviewData.id}/comment`);
                setComments(coms.comments);
                
            } catch (error) {
                console.error("Error checking review ownership:", error);
            }
        };
        fetchComments();
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
            <TextDefault style={{ color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 12 }}>
                Comentários
            </TextDefault>
            <CommentCard />
            {comments.length === 0 ? (
                <TextDefault style={{ color: "#aaa", fontSize: 14 }}>
                    Seja o primeiro a comentar!
                </TextDefault>
            ) : (
                comments.map((comment) => (
                    <View key={comment.id} style={{ marginBottom: 16 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                            <User size={16} color="#fff" />
                            <TextDefault style={{ color: "#fff", marginLeft: 4 }}>
                                {comment.Profile.username}
                            </TextDefault>
                        </View>
                        <TextDefault style={{ color: "#ddd" }}>{comment.body}</TextDefault>
                    </View>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718",
        padding: 16,
    },
});
