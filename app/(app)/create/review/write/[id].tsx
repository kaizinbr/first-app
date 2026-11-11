import WriteReviewPage from "@/components/reviews/create/main-write";
import type { Palette } from "@/lib/types";
import { Album } from "@/lib/types";
import { DraftStorage, useReviewSession } from "@/store/reviewSessionStore";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { getColors } from "react-native-image-colors";

export default function TracksPage() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const initSession = useReviewSession((s) => s.initSession);

    const [album, setAlbum] = useState<Album | null>(null);
    const [colors, setColors] = useState<Palette | null>(null);

    const reviewText = useReviewSession((s) => s.reviewText);
    const setReviewText = useReviewSession((s) => s.setReviewText);
    const overallRating = useReviewSession((s) => s.overallRating);
    const getRatingsArray = useReviewSession((s) => s.getRatingsArray);
    const clearSession = useReviewSession((s) => s.clearSession);
    const albumId = useReviewSession((s) => s.albumId);

    // garante que o store está com o draft correto pro álbum atual
    // caso o usuário acesse write diretamente sem passar por tracks
    const draft = albumId !== id ? DraftStorage.load(id) : null;
    const ratings = draft ? Object.values(draft.ratings) : getRatingsArray();
    const total = draft ? draft.overallRating : overallRating;
    const text = draft ? draft.reviewText : reviewText;

    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                const response = await api.get(`/albuns/${id}`);

                setAlbum(response.data);

                const palette = await getColors(response.data.images[0].url);
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

    return (
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
            <WriteReviewPage album={album} colors={colors} />
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
