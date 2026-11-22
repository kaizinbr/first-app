import TextDefault from "@/components/core/text-core";
import api from "@/lib/api";
import { UserProfile } from "@/lib/types";
import { selectAlbumColor } from "@/lib/util/selectRightColor";
import { darkenColor } from "@/lib/util/workWithColors";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useIsFocused } from "expo-router/react-navigation";
import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { getPalette } from "expo-color-thief-native";
import Animated, {
    FadeIn,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

export default function PlayingOnLastFM({
    data,
    expanded,
}: {
    data: UserProfile;
    expanded?: boolean;
}) {
    const router = useRouter();
    const isFocused = useIsFocused();

    const { data: playing, isError } = useQuery({
        queryKey: ["lastfm-playing", data.username],
        queryFn: async () => {
            const response = await api(
                `/users/${data.username}/lastfm/playing`,
            );
            return response.data.recenttracks.track[0] ?? null;
        },
        enabled: !!data.lastfm_username && isFocused,
        refetchInterval: 10_000,
        retry: false,
    });

    const track = isError ? null : playing;
    const imageUrl = track?.image?.[1]?.["#text"];

    const { data: albumColor } = useQuery({
        queryKey: ["album-color", imageUrl],
        queryFn: async () => {
            const palette = await getPalette(imageUrl, {
                colorCount: 6,
                quality: 10,
            });
            const color =
                selectAlbumColor(palette as any).hex ?? "rgba(22, 23, 24, 0.8)";
            return darkenColor(color, 0.3);
        },
        enabled: !!imageUrl,
        staleTime: Infinity,
    });

    const background = useSharedValue("rgba(22, 23, 24, 0.8)");

    useEffect(() => {
        if (albumColor) {
            background.value = withTiming(albumColor, { duration: 400 });
        }
    }, [albumColor]);

    const cardAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: background.value,
    }));

    if (!data.lastfm_username || !track) return null;

    return (
        <Animated.View
            style={[
                cardAnimatedStyle,
                {
                    marginTop: expanded ? 0 : 12,
                    borderRadius: expanded ? 18 : 12,
                    padding: expanded ? 16 : 12,
                    gap: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    maxWidth: expanded ? "100%" : 300,
                },
            ]}
        >
            <Pressable
                style={{ flexDirection: "row", gap: 12, alignItems: "center" }}
                onPress={() =>
                    router.push(
                        `/(app)/(tabs)/(search)?album=${track.album["#text"]}&artist=${track.artist["#text"]}`,
                    )
                }
            >
                <Animated.Image
                    key={track.name}
                    entering={FadeIn.duration(400)}
                    source={{
                        uri: imageUrl || "https://via.placeholder.com/150",
                    }}
                    style={[styles.albumArt, { width: expanded ? 48 : 36, height: expanded ? 48 : 36 }]}
                    resizeMode="cover"
                />
                <View style={{ justifyContent: "center", maxWidth: 232 }}>
                    <TextDefault style={styles.text}>Ouvindo agora</TextDefault>
                    <TextDefault
                        style={[styles.trackName, { fontSize: expanded ? 16 : 14, fontWeight: "700" }]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {track.name}
                    </TextDefault>
                    {expanded && (
                        <TextDefault
                            style={[styles.trackName, { fontSize: 14, fontWeight: "400" }]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {track.artist["#text"]}
                        </TextDefault>
                    )}
                </View>
            </Pressable>
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
    cardExpanded: {
        marginTop: 12,
        borderRadius: 12,
        padding: 12,
        gap: 8,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
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
