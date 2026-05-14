// app/(app)/create/review/tracks/[id].tsx
import ReviewCreateMain from "@/components/reviews/create/main-tracks";
import { apiAuth } from "@/lib/api";
import type { Palette } from "@/lib/types";
import { Album } from "@/lib/types";
import { useReviewSession } from "@/store/reviewSessionStore";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { getColors } from "react-native-image-colors";

export default function TracksPage() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const initSession = useReviewSession((s) => s.initSession);

    const [album, setAlbum] = useState<Album | null>(null);
    const [colors, setColors] = useState<Palette | null>(null);

    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                const response = await apiAuth(`/me/reviewed/${id}`);

                const initialRatings =
                    response.reviewed && response.rating
                        ? response.rating.ratings
                        : response.album.tracks.items.map((track: any) => ({
                              id: track.id,
                              value: 0,
                              favorite: false,
                              comment: "",
                              skip: false,
                          }));

                initSession(id, initialRatings);
                setAlbum(response.album);

                const palette = await getColors(response.album.images[0].url);
                setColors(palette as Palette);
            } catch (error) {
                console.error("Error fetching album data:", error);
            }
        };

        fetchReviewData();
    }, [id]);

    if (!album || !colors) {
        return (
            <View style={styles.overlay}>
                <ActivityIndicator size="large" color="#8065ef" />
            </View>
        );
    }

    return <ReviewCreateMain album={album} colors={colors} />;
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#161718",
    },
});
