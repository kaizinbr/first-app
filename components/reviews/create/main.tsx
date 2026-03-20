import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, TextInput } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackRating from "@/components/reviews/tracks";

import AlbumData from "@/components/reviews/display/data";
import AlbumHeader from "@/components/reviews/display/header";
import { Album, Palette, Review } from "@/lib/types";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { darkenColor } from "@/lib/util/workWithColors";
import TrackRater from "@/components/reviews/create/track-rating";
import ReviewStep from "@/components/reviews/create/review";

import CustomRangeSliderExample from "@/components/reviews/create/track-rating";

export default function ReviewCreateMain({
    reviewData,
    colors,
    total,
    handleInputChange,
    setRatings,
    ratings,
    totalInput,
    setTotalInput,
    useMedia,
    setUseMedia,
    handleSubmit,
    text, 
    setText,
}: {
    reviewData: {
        reviewed: boolean;
        rating: Review | null;
        album: Album;
    };
    colors: Palette;
    total: number;
    handleInputChange: (e: any) => void;
    setRatings: (ratings: any) => void;
    ratings: {
        id: string;
        value: number;
        favorite: boolean;
        comment: string;
        skip: boolean;
    }[];
    totalInput: string;
    setTotalInput: (value: string) => void;
    useMedia: boolean;
    setUseMedia: (value: boolean) => void;
    handleSubmit: () => void;
    text: string;
    setText: (value: string) => void;
}) {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const scrollY = useSharedValue(0);

    const HEADER_MAX_HEIGHT = 264;
    const HEADER_MIN_HEIGHT = insets.top + 50;
    const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const backgroundStyle = useAnimatedStyle(() => {
        const translateY = scrollY.value > 0 ? -scrollY.value : 0;
        const scale =
            scrollY.value < 0
                ? 1 + Math.abs(scrollY.value) / HEADER_MAX_HEIGHT
                : 1;
        return {
            transform: [{ translateY }, { scale }],
        };
    });

    const topBarStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [SCROLL_DISTANCE - 40, SCROLL_DISTANCE],
            [0, 1],
            Extrapolation.CLAMP,
        );
        return { opacity };
    });

    const headerContentStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, SCROLL_DISTANCE / 1.5],
            [1, 0],
            Extrapolation.CLAMP,
        );
        return { opacity };
    });

    const [step, setStep] = useState<"rating" | "review">("rating");

    const slideX = useSharedValue(0);

    const goToReview = () => {
        // Desliza pra esquerda e troca o step no meio da animação
        slideX.value = withTiming(-500, { duration: 300 }, (finished) => {
            if (finished) {
                runOnJS(setStep)("review");
                slideX.value = 500; // Começa do lado direito
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

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: slideX.value }],
    }));

    // React.useEffect(() => {
    //     console.log("Ratings atualizados:", ratings);
    //     handleInputChange(ratings);
    // }, [ratings]);

    return (
        <View>
            {step === "rating" ? (
                <>
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
                        <Text style={styles.fixedTitle} numberOfLines={1}>
                            {reviewData.album.name}
                        </Text>
                    </Animated.View>

                    <Pressable
                        onPress={() => router.back()}
                        style={[styles.backButton, { top: insets.top }]}
                    >
                        <Text
                            style={{
                                color: "#eee",
                                fontSize: 24,
                                fontWeight: "bold",
                            }}
                        >
                            ←
                        </Text>
                    </Pressable>

                    <Animated.ScrollView
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        style={{ zIndex: 1 }}
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
                                data={reviewData.album}
                                headerContentStyle={headerContentStyle}
                            />
                            <AlbumData
                                data={reviewData.album}
                                headerContentStyle={headerContentStyle}
                            />
                        </View>

                        <Animated.View style={[styles.main]}>
                            <View
                                style={{
                                    width: "100%",
                                    paddingHorizontal: 16,
                                }}
                            >
                                <View style={styles.textSec}>
                                    <Text style={styles.textDefault}>
                                        Nota do álbum
                                    </Text>
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
                                                    parseFloat(
                                                        totalInput,
                                                    ).toFixed(2),
                                                ).toString();
                                                setTotalInput(formatted);
                                            }}
                                        />
                                        {/* <Text style={styles.inputSide}>/100</Text> */}
                                    </View>

                                    <View style={styles.toggleRow}>
                                        <Pressable
                                            style={[
                                                styles.toggleBtn,
                                                useMedia &&
                                                    styles.toggleBtnActive,
                                            ]}
                                            onPress={() => setUseMedia(true)}
                                        >
                                            <Text
                                                style={[
                                                    styles.toggleText,
                                                    useMedia &&
                                                        styles.toggleTextActive,
                                                ]}
                                            >
                                                Automático
                                            </Text>
                                        </Pressable>
                                        <Pressable
                                            style={[
                                                styles.toggleBtn,
                                                !useMedia &&
                                                    styles.toggleBtnActive,
                                            ]}
                                            onPress={() => setUseMedia(false)}
                                        >
                                            <Text
                                                style={[
                                                    styles.toggleText,
                                                    !useMedia &&
                                                        styles.toggleTextActive,
                                                ]}
                                            >
                                                Manual
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>

                                <TrackRater
                                    reviewData={reviewData}
                                    setRatings={setRatings}
                                />

                                <Pressable
                                    onPress={goToReview}
                                    style={({ pressed }) => [
                                        styles.nextBtn,
                                        {
                                            backgroundColor: pressed
                                                ? darkenColor(
                                                      selectRightColor(colors),
                                                      0.2,
                                                  )
                                                : darkenColor(
                                                      selectRightColor(colors),
                                                      0.7,
                                                  ),
                                        },
                                    ]}
                                >
                                    <Text
                                        style={{
                                            color: "#eee",
                                            fontSize: 16,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Próximo
                                    </Text>
                                </Pressable>
                            </View>
                        </Animated.View>
                    </Animated.ScrollView>
                </>
            ) : (
                <ReviewStep
                    reviewData={reviewData}
                    total={total}
                    colors={colors}
                    onSubmit={handleSubmit}
                    goBack={goBack}
                    text={text}
                    setText={setText}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718",
    },
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
    fixedTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
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
        // paddingTop: 16,
        // paddingHorizontal: 16,
        justifyContent: "flex-start",
    },
    textSec: {
        padding: 16,
        width: "100%",
        borderRadius: 12,
        backgroundColor: "#222",
        marginBottom: 16,
    },
    textDefault: {
        color: "#eee",
        fontSize: 16,
        fontWeight: "800",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        fontSize: 24,
        color: "#eeeeee",
        fontWeight: "bold",
    },
    inputSide: {
        fontSize: 24,
        color: "#eeeeee",
    },
    tracks: {
        width: "100%",
        gap: 12,
        paddingHorizontal: 16,
    },
    toggleRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },
    toggleBtn: {
        // flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 32,
        backgroundColor: "#333",
        alignItems: "center",
    },
    toggleBtnActive: {
        backgroundColor: "#555",
    },
    toggleText: {
        color: "#eee",
        fontSize: 12,
    },
    toggleTextActive: {
        color: "#fff",
    },
    nextBtn: {
        marginTop: 16,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
});
