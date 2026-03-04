import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import api from "@/lib/api";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { displayPastRelativeTime } from "@/lib/util/time";
import TiptapRenderer from "@/components/home/card-content copy";
import { AlbumCard } from "@/components/home/album-section";
import { Review } from "@/lib/types";

type SpotifyAlbum = {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    images: Array<{
        url: string;
        height: number;
        width: number;
    }>;
    name: string;
    release_date: string;
    release_date_precision: string;
    type: string;
    uri: string;
    artists: {
        id: string;
        name: string;
    }[];
    tracks: Record<string, unknown>;
    copyrights: unknown[];
    external_ids: {
        upc: string;
    };
    genres: string[];
    label: string;
    popularity: number;
};

export default function FeedCard({ review }: { review: Review }) {
    const { data: session } = authClient.useSession();

    const [reviewAlbum, setReviewAlbum] = useState<SpotifyAlbum | null>(null);
    const [content, setContent] = useState<{
        jsonContent: any;
        html: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedData = async () => {
            try {
                const response = await api.get(`/albuns/${review.album_id}`);
                setReviewAlbum(response.data);
                // console.log("Feed data fetched successfully:", response.data);
                // console.log("total reviews:", feedData!.totalReviews);
            } catch (error) {
                console.error("Error fetching feed data:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchContent = async () => {
            if (!review.shorten) {
                console.error("Review shorten is undefined");
                return;
            }

            if (
                !Array.isArray(review.content.content) ||
                review.content.content.length === 0 ||
                !Array.isArray(review.content.content[0].content) ||
                review.content.content[0].content.length === 0 ||
                review.content.content[0].content[0].text === ""
            ) {
                console.warn("Review content is empty");
                return;
            }

            try {
                const response = await api.get(
                    `/reviews/${review.shorten}/content`,
                );
                setContent(response.data);
                // console.log("Content fetched successfully:", content.html);
            } catch (error) {
                console.error("Error fetching content:", error);
            }
        };

        fetchFeedData();
        fetchContent();
    }, []);

    return (
        <Pressable
            // onPress={() => router.push(`/review/${review.shorten}`)}
            style={({ pressed }) => [
                styles.main,
                pressed && styles.mainPressed,
            ]}
        >
            <View style={styles.card}>
                <Image
                    source={{ uri: review.Profile.avatar_url! }}
                    style={styles.cardImage}
                />
                {reviewAlbum ? (
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>
                            {review.Profile.name} avaliou {reviewAlbum.name} de{" "}
                            {reviewAlbum.artists
                                .map((artist) => artist.name)
                                .join(", ")}
                        </Text>
                        {content ? (
                            <>
                                <TiptapRenderer json={content.jsonContent} />
                            </>
                        ) : null}

                        <AlbumCard
                            image={reviewAlbum.images[0].url}
                            value={
                                review.total
                                    ? `${Number(review.total).toFixed(1)}/100`
                                    : "0.0/100"
                            }
                            subtitle={review.ratings.length}
                        />
                        <Text style={styles.cardDate}>
                            {displayPastRelativeTime(
                                new Date(review.created_at),
                            )}
                        </Text>
                    </View>
                ) : null}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    main: {
        width: "100%",
        backgroundColor: "transparent",
        borderRadius: 8,
    },
    mainPressed: {
        backgroundColor: "#1e1e1e",
    },
    card: {
        width: "100%",
        backgroundColor: "transparent",
        color: "#eee",
        padding: 16,
        borderRadius: 8,
        flexDirection: "row",
        gap: 8,
    },
    cardImage: {
        width: 32,
        height: 32,
        backgroundColor: "#bbb",
        borderRadius: 32 * 0.306,
        marginBottom: 8,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontWeight: "bold",
        color: "#eee",
    },
    albumSection: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 12,
        color: "#eee",
        padding: 12,
        backgroundColor: "#1e1e1e",
        borderRadius: 8,
        borderColor: "#333",
        borderWidth: 0.5,
    },
    albumSectionValue: {
        fontWeight: 900,
        color: "#eee",
        fontSize: 20,
    },
    albumSectionText: {
        color: "#eee",
        fontSize: 12,
        marginTop: 6,
    },
    cardDate: {
        marginTop: 8,
        color: "#aaa",
        fontSize: 12,
    },
});
