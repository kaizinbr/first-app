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

interface LikeButtonProps {
    ratingId: string;
    initialLiked?: boolean;
    initialCount: number;
    size?: "sm" | "md"; // sm = feed card, md = tela de detalhe
}

export function LikeButton({
    ratingId,
    initialLiked,
    initialCount,
    size = "sm" ,
}: LikeButtonProps) {
    console.log(initialCount)
    const { liked, count, toggle, loading } = useLike({
        ratingId,
        initialCount,
    });

    useEffect(() => {
        // console.log("LikeButton state updated for ratingId:", ratingId, "liked:", liked, "count:", count);
    }, [liked, count, ratingId]);

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
    const iconSize = size === "sm" ? 18 : 24;
    const textStyle = size === "sm" ? styles.countSm : styles.countMd;

    return (
        <Pressable
            onPress={handlePress}
            disabled={loading}
            style={styles.container}
            hitSlop={8}
        >
            <Animated.View style={animatedStyle}>
                {liked ? (
                    <HeartBold size={iconSize} color="#e53935" />
                ) : (
                    <HeartOutline size={iconSize} color="#888" />
                )}
            </Animated.View>
            {count > 0 && (
                <Text style={[textStyle, liked && styles.countActive]}>
                    {count}
                </Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    countSm: {
        fontSize: 13,
        color: "#888",
        fontVariant: ["tabular-nums"],
    },
    countMd: {
        fontSize: 16,
        color: "#888",
        fontVariant: ["tabular-nums"],
    },
    countActive: {
        color: "#e53935",
    },
});
