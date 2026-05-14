// components/reviews/create/main.tsx
import { AltArrowLeft } from "@solar-icons/react-native/Outline";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import TextDefault from "@/components/core/text-core";
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ReviewStep from "@/components/reviews/create/review";
import TrackRater from "@/components/reviews/create/track-rating";
import AlbumData from "@/components/reviews/display/data";
import AlbumHeader from "@/components/reviews/display/header";
import Lyrics from "@/components/reviews/create/lyrics";
import { Album, Palette } from "@/lib/types";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { darkenColor } from "@/lib/util/workWithColors";
import { useReviewSession } from "@/store/reviewSessionStore";

export default function ReviewCreateMain({
    album,
    colors,
}: {
    album: Album;
    colors: Palette;
}) {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const overallRating = useReviewSession((s) => s.overallRating);
    const setOverallRating = useReviewSession((s) => s.setOverallRating);
    const useMedia = useReviewSession((s) => s.useMedia);
    const setUseMedia = useReviewSession((s) => s.setUseMedia);
    const ratings = useReviewSession((s) => s.ratings);
    const reviewText = useReviewSession((s) => s.reviewText);
    const setReviewText = useReviewSession((s) => s.setReviewText);

    const [totalInput, setTotalInput] = useState(
        overallRating > 0 ? overallRating.toString() : "",
    );
    const [currentTrack, setCurrentTrack] = useState(0);
    const [showLyrics, setShowLyrics] = useState(false);
    const [step, setStep] = useState<"rating" | "review">("rating");

    const scrollY = useSharedValue(0);
    const slideX = useSharedValue(0);

    const HEADER_MAX_HEIGHT = 264;
    const HEADER_MIN_HEIGHT = insets.top + 50;
    const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

    useEffect(() => {
        if (!useMedia) return;
        const values = Object.values(ratings);
        if (values.length === 0) return;
        const avg = values.reduce((acc, r) => acc + r.value, 0) / values.length;
        const rounded = parseFloat(avg.toFixed(2));
        setOverallRating(rounded);
        setTotalInput(rounded.toString());
    }, [ratings, useMedia]);

    const handleInputChange = (text: string) => {
        const normalized = text.replace(",", ".");
        if (normalized === "" || normalized === ".") {
            setTotalInput(normalized);
            setOverallRating(0);
            return;
        }
        if (!/^\d+\.?\d{0,2}$/.test(normalized)) return;
        const number = parseFloat(normalized);
        if (isNaN(number)) return;
        const clamped = Math.min(100, Math.max(0, number));
        setTotalInput(normalized);
        setOverallRating(clamped);
    };

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const backgroundStyle = useAnimatedStyle(() => {
        const translateY = scrollY.value > 0 ? -scrollY.value : 0;
        const scale =
            scrollY.value < 0
                ? 1 + Math.abs(scrollY.value) / HEADER_MAX_HEIGHT
                : 1;
        return { transform: [{ translateY }, { scale }] };
    });

    const topBarStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            scrollY.value,
            [SCROLL_DISTANCE - 40, SCROLL_DISTANCE],
            [0, 1],
            Extrapolation.CLAMP,
        ),
    }));

    const headerContentStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            scrollY.value,
            [0, SCROLL_DISTANCE / 1.5],
            [1, 0],
            Extrapolation.CLAMP,
        ),
    }));

    const goToReview = () => {
        slideX.value = withTiming(-500, { duration: 300 }, (finished) => {
            if (finished) {
                runOnJS(setStep)("review");
                slideX.value = 500;
                slideX.value = withTiming(0, { duration: 300 });
            }
        });
    };

    const goBack = () => {
        slideX.value = withTiming(500, { duration: 300 }, (finished) => {
            if (finished) {
                runOnJS(setStep)("rating");
                slideX.value = -500;
                slideX.value = withTiming(0, { duration: 300 });
            }
        });
    };

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.gradientContainer,
                    { height: HEADER_MAX_HEIGHT },
                    backgroundStyle,
                ]}
            >
                <LinearGradient
                    colors={[selectRightColor(colors), "#161718"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
                <LinearGradient
                    colors={[colors.muted, "#161718"]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
                />
                <LinearGradient
                    colors={["transparent", "rgba(22, 23, 24, 1)"]}
                    start={{ x: 0.5, y: 0.2 }}
                    end={{ x: 0.5, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>

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
                pointerEvents="none"
            >
                <TextDefault style={styles.fixedTitle} numberOfLines={1}>
                    {album.name}
                </TextDefault>
            </Animated.View>

            <Pressable
                onPress={() => router.back()}
                style={[styles.backButton, { top: insets.top + 4 }]}
            >
                <AltArrowLeft size={32} color="#eee" />
            </Pressable>

            <Animated.ScrollView
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={{ zIndex: 1 }}
                nestedScrollEnabled
            >
                <View
                    style={{
                        backgroundColor: "transparent",
                        paddingBottom: 16,
                        paddingRight: 16,
                        flexDirection: "row",
                    }}
                >
                    <AlbumHeader
                        maxHeight={HEADER_MAX_HEIGHT}
                        data={album}
                        headerContentStyle={headerContentStyle}
                    />
                    <AlbumData
                        data={album}
                        headerContentStyle={headerContentStyle}
                    />
                </View>

                <Animated.View style={styles.main}>
                    <View style={{ width: "100%", paddingHorizontal: 16 }}>
                        <View style={styles.textSec}>
                            <TextDefault style={styles.textDefault}>
                                Nota do álbum
                            </TextDefault>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0 - 100"
                                    keyboardType="decimal-pad"
                                    value={totalInput}
                                    onChangeText={handleInputChange}
                                    editable={!useMedia}
                                    onBlur={() => {
                                        if (
                                            totalInput === "" ||
                                            totalInput === "."
                                        ) {
                                            setTotalInput("");
                                            return;
                                        }
                                        const formatted = Number(
                                            parseFloat(totalInput).toFixed(2),
                                        ).toString();
                                        setTotalInput(formatted);
                                    }}
                                />
                            </View>

                            <View style={styles.toggleRow}>
                                <Pressable
                                    style={[
                                        styles.toggleBtn,
                                        useMedia && styles.toggleBtnActive,
                                    ]}
                                    onPress={() => setUseMedia(true)}
                                >
                                    <TextDefault
                                        style={[
                                            styles.toggleText,
                                            useMedia && styles.toggleTextActive,
                                        ]}
                                    >
                                        Automático
                                    </TextDefault>
                                </Pressable>
                                <Pressable
                                    style={[
                                        styles.toggleBtn,
                                        !useMedia && styles.toggleBtnActive,
                                    ]}
                                    onPress={() => setUseMedia(false)}
                                >
                                    <TextDefault
                                        style={[
                                            styles.toggleText,
                                            !useMedia &&
                                                styles.toggleTextActive,
                                        ]}
                                    >
                                        Manual
                                    </TextDefault>
                                </Pressable>
                            </View>
                        </View>

                        <TrackRater
                            album={album}
                            colors={colors}
                            currentTrack={currentTrack}
                            setCurrentTrack={setCurrentTrack}
                            showLyrics={showLyrics}
                            setShowLyrics={setShowLyrics}
                        />

                        {/* {showLyrics && (
                                    <Lyrics
                                        reviewData={{ album }}
                                        colors={colors}
                                        currentTrack={currentTrack}
                                    />
                                )} */}
                    </View>
                    <View style={{ height: 80 }} />
                </Animated.View>
            </Animated.ScrollView>

            <Pressable
                onPress={() => {
                    router.push({
                        pathname: `/(app)/create/review/write/[id]`,
                        params: { id: album.id },
                    })
                }}
                style={({ pressed }) => [
                    styles.nextBtn,
                ]}
            >
                <TextDefault
                    style={{ color: "#eee", fontSize: 16, fontWeight: "bold" }}
                >
                    Próximo
                </TextDefault>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#161718" },
    gradientContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0,
    },
    fixedTopBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    fixedTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    backButton: {
        position: "absolute",
        left: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
    },
    main: {
        flex: 1,
        backgroundColor: "#161718",
        alignItems: "center",
        width: "100%",
        justifyContent: "flex-start",
    },
    textSec: {
        padding: 16,
        width: "100%",
        borderRadius: 12,
        backgroundColor: "#1b1c1d",
        marginBottom: 16,
    },
    textDefault: { color: "#eee", fontSize: 16, fontWeight: "800" },
    inputWrapper: { flexDirection: "row", alignItems: "center" },
    input: {
        fontSize: 24,
        color: "#eeeeee",
        fontWeight: "bold",
        fontFamily: "Walsheim",
    },
    toggleRow: { flexDirection: "row", gap: 12, marginTop: 8 },
    toggleBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 32,
        backgroundColor: "#282828",
        alignItems: "center",
    },
    toggleBtnActive: { backgroundColor: "#8065ef" },
    toggleText: { color: "#eee", fontSize: 12 },
    toggleTextActive: { color: "#fff" },
    nextBtn: {
        marginTop: 16,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        position: "absolute",
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 10,
        backgroundColor: "#8065ef",
    },
});
