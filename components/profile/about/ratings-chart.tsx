import React, { useState, useEffect } from "react";
import { View, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    Easing,
} from "react-native-reanimated";
import TextDefault from "@/components/core/text-core";
import api from "@/lib/api";
import { UserProfile } from "@/lib/types";

type RatingDatum = {
    rate: number; // 1 a 5
    count: number;
};

type Props = {
    data: RatingDatum[]; // ex: [{star:1,count:0},{star:2,count:1},...,{star:5,count:12}]
    barColor?: string;
    height?: number; // altura máxima disponível pro gráfico
};

const MAX_BAR_HEIGHT = 90;

function Bar({
    datum,
    maxCount,
    barColor,
    isActive,
    onPress,
}: {
    datum: RatingDatum;
    maxCount: number;
    barColor: string;
    isActive: boolean;
    onPress: () => void;
}) {
    const targetHeight =
        maxCount > 0
            ? Math.max(6, (datum.count / maxCount) * MAX_BAR_HEIGHT)
            : 6;

    const height = useSharedValue(0);
    const tooltipOpacity = useSharedValue(0);
    const tooltipTranslate = useSharedValue(6);

    React.useEffect(() => {
        height.value = withTiming(targetHeight, {
            duration: 500,
            easing: Easing.out(Easing.cubic),
        });
    }, [targetHeight]);

    React.useEffect(() => {
        if (isActive) {
            tooltipOpacity.value = withTiming(1, { duration: 150 });
            tooltipTranslate.value = withSpring(0, {
                damping: 14,
                stiffness: 180,
            });
        } else {
            tooltipOpacity.value = withTiming(0, { duration: 120 });
            tooltipTranslate.value = 6;
        }
    }, [isActive]);

    const barStyle = useAnimatedStyle(() => ({
        height: height.value,
        backgroundColor: barColor,
        opacity: isActive ? 1 : 0.85,
    }));

    const tooltipStyle = useAnimatedStyle(() => ({
        opacity: tooltipOpacity.value,
        transform: [{ translateY: tooltipTranslate.value }],
    }));

    return (
        <Pressable onPress={onPress} style={styles.barColumn} hitSlop={6}>
            <Animated.View
                style={[styles.tooltip, tooltipStyle]}
                pointerEvents="none"
            >
                <TextDefault style={styles.tooltipText}>
                    {datum.count}
                </TextDefault>
            </Animated.View>
            <Animated.View style={[styles.bar, barStyle]} />
            <TextDefault style={styles.starLabel}>{datum.rate}</TextDefault>
        </Pressable>
    );
}

export default function RatingBarChart({
    data,
    barColor = "#8065ef",
}: {
    data: UserProfile;
    barColor?: string;
    height?: number;
}) {
    const [activeStar, setActiveStar] = useState<number | null>(null);
    const [maxCount, setMaxCount] = useState<number>(0);

    const [loading, setLoading] = useState(true);
    const [buckets, setBuckets] = useState<RatingDatum[]>([]);
    const [totalRatings, setTotalRatings] = useState<number>(0);
    const thisYear = new Date().getFullYear();
    const [currentYearRatings, setCurrentYearRatings] = useState<number>(0);

    useEffect(() => {
        const fetchBuckets = async () => {
            try {
                const response = await api.get(
                    `/users/${data.lowername}/reviews/chart`,
                );
                console.log("Fetched rating buckets:", response.data.buckets);
                setBuckets(response.data.buckets);
                setTotalRatings(response.data.totalReviews);
                setCurrentYearRatings(response.data.currentYearReviews);
                const max = Math.max(
                    ...response.data.buckets.map((b: any) => b.count),
                );
                setMaxCount(max);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching rating buckets:", error);
                setLoading(false);
            }
        };

        fetchBuckets();
    }, [data]);

    return (
        <View
            style={{
                backgroundColor: "#212223",
                padding: 16,
                borderRadius: 12,
                gap: 8,
            }}
        >
            {loading ? (
                <ActivityIndicator size="large" color="#8065ef" />
            ) : (
                <>
                    <TextDefault style={[styles.title]}>
                        Avaliações de {data.name}
                    </TextDefault>
                    <View style={styles.container}>
                        {buckets.map((datum) => (
                            <Bar
                                key={datum.rate}
                                datum={datum}
                                maxCount={maxCount}
                                barColor={barColor}
                                isActive={activeStar === datum.rate}
                                onPress={() =>
                                    setActiveStar((prev) =>
                                        prev === datum.rate ? null : datum.rate,
                                    )
                                }
                            />
                        ))}
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            marginTop: 8,
                            gap: 16,
                        }}
                    >
                        <View style={{ alignItems: "center", marginRight: 0 }}>
                            <TextDefault
                                style={{
                                    color: "#eee",
                                    fontSize: 24,
                                    fontWeight: "bold",
                                }}
                            >
                                {buckets[10]?.count || 0}
                            </TextDefault>
                            <TextDefault
                                style={{ color: "#8a8a90", fontSize: 12 }}
                            >
                                notas 100
                            </TextDefault>
                        </View>
                        <View
                            style={{
                                height: 40,
                                borderWidth: 1,
                                borderColor: "#4a4a4a",
                            }}
                        />
                        <View style={{ alignItems: "center", marginRight: 0 }}>
                            <TextDefault
                                style={{
                                    color: "#eee",
                                    fontSize: 24,
                                    fontWeight: "bold",
                                }}
                            >
                                {totalRatings}
                            </TextDefault>
                            <TextDefault
                                style={{ color: "#8a8a90", fontSize: 12 }}
                            >
                                reviews
                            </TextDefault>
                        </View>
                        <View
                            style={{
                                height: 40,
                                borderWidth: 1,
                                borderColor: "#4a4a4a",
                            }}
                        />
                        <View style={{ alignItems: "center", marginRight: 0 }}>
                            <TextDefault
                                style={{
                                    color: "#eee",
                                    fontSize: 24,
                                    fontWeight: "bold",
                                }}
                            >
                                {currentYearRatings || 0}
                            </TextDefault>
                            <TextDefault
                                style={{ color: "#8a8a90", fontSize: 12 }}
                            >
                                em {thisYear}
                            </TextDefault>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        height: MAX_BAR_HEIGHT + 40,
        gap: 4,
    },
    sec: {
        backgroundColor: "#212223",
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    title: {
        color: "#989898",
        fontSize: 14,
        fontWeight: "bold",
    },
    barColumn: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        zIndex: 1,
    },
    bar: {
        width: "100%",
        borderRadius: 6,
    },
    starLabel: {
        marginTop: 6,
        fontSize: 11,
        color: "#8a8a90",
    },
    tooltip: {
        backgroundColor: "#1c1c22",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginBottom: 6,
        width: 32,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        position: "relative",
    },
    tooltipText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
        textAlign: "center",
    },
});
