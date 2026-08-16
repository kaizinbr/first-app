import { Pressable, Text, StyleSheet, View } from "react-native";
import { useState, useEffect, use } from "react";
import { useRouter } from "expo-router";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
} from "react-native-reanimated";
import { useLike } from "@/lib/util/useLike";

// Solar Icons
import {
    ChatRound,
    ChatSquare,
    Share,
} from "@/lib/solar-icons/Outline";
import { HeartBold, HeartOutline } from "@/lib/solar-icons";
import TextDefault from "@/components/core/text-core";

export function CommentButton({
    reviewId,
    initialLiked,
    initialCount,
    size = "sm",
    style,
}: {
    reviewId: string;
    initialLiked?: boolean;
    initialCount: number;
    size?: "sm" | "md";
    style?: any;
}) {
    const router = useRouter();

    const textStyle = size === "sm" ? styles.countSm : styles.countMd;

    return (
        <Pressable
            onPress={() => router.push(`/review/${reviewId}#comments`)}
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
            }}
        >
            <ChatSquare size={20} color="#888" />
            <TextDefault style={textStyle}>{initialCount}</TextDefault>
        </Pressable>
    );
}

// export function LikeCommentButton({
//     commentId,
//     initialLiked,
//     initialCount,
//     size = "sm",
//     style,
// }: {
//     commentId: string;
//     initialLiked?: boolean;
//     initialCount: number;
//     size?: "sm" | "md"; // sm = feed card, md = tela de detalhe
//     style?: any;
// }) {
//     const { liked, count, toggle, loading } = useLike({
//         id: commentId,
//         initialCount,
//         type: "comment",
//     });

//     useEffect(() => {}, [liked, count, commentId]);

//     const scale = useSharedValue(1);

//     const animatedStyle = useAnimatedStyle(() => ({
//         transform: [{ scale: scale.value }],
//     }));

//     const handlePress = () => {
//         // if (!authenticated) {
//         //     // redireciona pro login ou mostra toast
//         //     router.push("/login");
//         //     return;
//         // }

//         scale.value = withSequence(
//             withSpring(0.75, { duration: 100 }),
//             withSpring(1.2, { duration: 150 }),
//             withSpring(1, { duration: 200 }),
//         );
//         toggle();
//     };
//     const iconSize = size === "sm" ? 18 : 22;
//     const textStyle = size === "sm" ? styles.countSm : styles.countMd;

//     return (
//         <Pressable
//             onPress={() => router.push(`/review/${review.id}#comments`)}
//             style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 gap: 4,
//             }}
//         >
//             <ChatSquare size={20} color="#888" />
//             <TextDefault style={styles.extraInfo}>0</TextDefault>
//         </Pressable>
//     );
// }

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingVertical: 4,
        maxWidth: 40,
        // backgroundColor: "red",
    },
    countSm: {
        fontSize: 13,
        color: "#888",
        fontVariant: ["tabular-nums"],
    },
    countMd: {
        fontSize: 14,
        color: "#888",
        fontVariant: ["tabular-nums"],
    },
    countActive: {
        color: "#e53935",
    },
});
