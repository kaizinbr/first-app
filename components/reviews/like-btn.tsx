// components/LikeButton.tsx
import { Pressable, Text, StyleSheet, View } from "react-native";
import { useState, useEffect, use } from "react";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
} from "react-native-reanimated";
import { useLike } from "@/lib/util/useLike";

// Solar Icons
import { HeartBold, HeartOutline } from "@solar-icons/react-native";
import TextDefault from "@/components/core/text-core";


export function LikeButton({
    ratingId,
    initialLiked,
    initialCount,
    size = "sm",
    style
}: {
    ratingId: string;
    initialLiked?: boolean;
    initialCount: number;
    size?: "sm" | "md"; 
    style?: any;
}) {
    const { liked, count, toggle, loading } = useLike({
        id: ratingId,
        initialCount,
        type: "review",
    });

    useEffect(() => {}, [liked, count, ratingId]);

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
        // if (!authenticated) {
        //     // redireciona pro login ou mostra toast
        //     router.push("/login");
        //     return;
        // }

        scale.value = withSequence(
            withSpring(0.75, { duration: 100 }),
            withSpring(1.2, { duration: 150 }),
            withSpring(1, { duration: 200 }),
        );
        toggle();
    };
    const iconSize = size === "sm" ? 18 : 22;
    const textStyle = size === "sm" ? styles.countSm : styles.countMd;

    return (
        <Pressable
            onPress={handlePress}
            disabled={loading}
            style={[styles.container, style]}
            hitSlop={8}
        >
            <Animated.View style={animatedStyle}>
                {liked ? (
                    <HeartBold size={iconSize} color="#e53935" />
                ) : (
                    <HeartOutline size={iconSize} color="#888" />
                )}
            </Animated.View>
            <TextDefault style={[textStyle, liked && styles.countActive]}>
                {count > 999 ? "1K+" : count < 0 ? 0 : count}
            </TextDefault>
        </Pressable>
    );
}

export function LikeCommentButton({
    commentId,
    initialLiked,
    initialCount,
    size = "sm",
    style
}: {
    commentId: string;
    initialLiked?: boolean;
    initialCount: number;
    size?: "sm" | "md"; // sm = feed card, md = tela de detalhe
    style?: any;
}) {
    const { liked, count, toggle, loading } = useLike({
        id: commentId,
        initialCount,
        type: "comment",
    });

    useEffect(() => {}, [liked, count, commentId]);

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
        // if (!authenticated) {
        //     // redireciona pro login ou mostra toast
        //     router.push("/login");
        //     return;
        // }

        scale.value = withSequence(
            withSpring(0.75, { duration: 100 }),
            withSpring(1.2, { duration: 150 }),
            withSpring(1, { duration: 200 }),
        );
        toggle();
    };
    const iconSize = size === "sm" ? 18 : 22;
    const textStyle = size === "sm" ? styles.countSm : styles.countMd;

    return (
        <Pressable
            onPress={handlePress}
            disabled={loading}
            style={[styles.container, style]}
            hitSlop={8}
        >
            <Animated.View style={animatedStyle}>
                {liked ? (
                    <HeartBold size={iconSize} color="#e53935" />
                ) : (
                    <HeartOutline size={iconSize} color="#888" />
                )}
            </Animated.View>
            <TextDefault style={[textStyle, liked && styles.countActive]}>
                {count > 999 ? "1K+" : count < 0 ? 0 : count}
            </TextDefault>
        </Pressable>
    );
}

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
