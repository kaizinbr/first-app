import { useEffect, useRef, useCallback, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Image } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolateColor,
    runOnJS,
} from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";
import TextDefault from "@/components/core/text-core";
import api from "@/lib/api";
import { UserProfile, Palette } from "@/lib/types";
import { getColors } from "react-native-image-colors";
import { selectRightColor } from "@/lib/util/selectRightColor";

const POLL_INTERVAL = 10_000;
const FADE_MS = 400;

export default function PlayingOnLastFM({ data }: { data: UserProfile }) {
    const [loading, setLoading] = useState(true);
    const [track, setTrack] = useState<any>(null);
    const [colors, setColors] = useState<any>(null);
    const [error, setError] = useState("");
    const isFetchingRef = useRef(false);
    const currentTrackName = useRef<string | null>(null);
    const isFocused = useIsFocused();

    const imageOpacity = useSharedValue(1);
    const colorProgress = useSharedValue(0);
    const prevColor = useSharedValue("rgba(22, 23, 24, 0.8)");
    const nextColor = useSharedValue("rgba(22, 23, 24, 0.8)");

    const applyNewTrack = useCallback((newTrack: any, newColors: any) => {
        setTrack(newTrack);
        setColors(newColors);
    }, []);

    const animateTransition = useCallback(
        (newTrack: any, newColors: any, newColor: string) => {
            imageOpacity.value = withTiming(
                0,
                { duration: FADE_MS / 2 },
                (finished) => {
                    if (!finished) return;
                    runOnJS(applyNewTrack)(newTrack, newColors);
                    prevColor.value = nextColor.value;
                    nextColor.value = newColor;
                    colorProgress.value = 0;
                    colorProgress.value = withTiming(1, { duration: FADE_MS });
                    imageOpacity.value = withTiming(1, {
                        duration: FADE_MS / 2,
                    });
                },
            );
        },
        [],
    );

    const cardAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            colorProgress.value,
            [0, 1],
            [prevColor.value, nextColor.value],
        ),
    }));

    const imageAnimatedStyle = useAnimatedStyle(() => ({
        opacity: imageOpacity.value,
    }));

    const fetchNowPlaying = useCallback(async () => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        try {
            const response = await api(
                `/users/${data.username}/lastfm/playing`,
            );
            const newTrack = response.data.recenttracks.track[0];
            const resultColors = await getColors(newTrack.image[1]["#text"], {
                fallback: "#000",
                cache: true,
            });

            const newColor =
                (resultColors as any)?.darkMuted ?? "rgba(22, 23, 24, 0.8)";

            if (currentTrackName.current !== newTrack?.name) {
                currentTrackName.current = newTrack?.name ?? null;

                if (currentTrackName.current === null) {
                    prevColor.value = newColor;
                    nextColor.value = newColor;
                    applyNewTrack(newTrack, resultColors);
                } else {
                    animateTransition(newTrack, resultColors, newColor);
                }
            }
        } catch (err) {
            setError("Failed to fetch LastFM data");
        } finally {
            isFetchingRef.current = false;
            setLoading(false);
        }
    }, [data.username]);

    useEffect(() => {
        if (!data.lastfm_username || !isFocused) return;
        fetchNowPlaying();
        const interval = setInterval(fetchNowPlaying, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [isFocused, fetchNowPlaying]);

    if (!data.lastfm_username || !track) return null;
    if (loading)
        return <ActivityIndicator style={{ marginTop: 12 }} color="#eee" />;
    if (error) return null;

    return (
        <Animated.View style={[styles.card, cardAnimatedStyle]}>
            <Animated.Image
                source={{
                    uri:
                        track?.image[1]["#text"] ||
                        "https://via.placeholder.com/150",
                }}
                style={[styles.albumArt, imageAnimatedStyle]}
                resizeMode="cover"
            />
            <View style={{ justifyContent: "center", maxWidth: 232 }}>
                <TextDefault style={styles.text}>Ouvindo agora</TextDefault>
                <TextDefault
                    style={styles.trackName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {track?.name}
                </TextDefault>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 12,
        borderRadius: 12,
        padding: 12,
        gap: 8,
        flexDirection: "row",
        alignItems: "center",
        maxWidth: 300,
    },
    albumArt: { width: 36, height: 36, borderRadius: 4 },
    text: { color: "#eee", fontSize: 11, fontFamily: "Walsheim" },
    trackName: {
        color: "#eee",
        fontSize: 14,
        fontFamily: "Walsheim",
        fontWeight: "700",
    },
});
