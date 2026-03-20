import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { EnrichedMarkdownText } from "react-native-enriched-markdown";
import { truncateMarkdown } from "@/lib/util/truncate";

import { authClient } from "@/lib/auth-client";
import { useRouter, Href, Link } from "expo-router";
import api from "@/lib/api";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { displayPastRelativeTime } from "@/lib/util/time";
import TiptapRenderer from "@/components/home/card-content copy";
import { AlbumCard } from "@/components/home/album-section";
import { ReviewWithAlbum } from "@/lib/types";

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

const MAX_PREVIEW_CHARS = 500;

export default function FeedCard({ review }: { review: ReviewWithAlbum }) {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const [reviewAlbum, setReviewAlbum] = useState<SpotifyAlbum | null>(null);
    const [content, setContent] = useState<{
        jsonContent: any;
        html: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);

        const previewContent = review.review
        ? truncateMarkdown(review.review, MAX_PREVIEW_CHARS)
        : null;

    const isTruncated = review.review
        ? review.review.length > MAX_PREVIEW_CHARS
        : false;

    useEffect(() => {
        // const fetchFeedData = async () => {
        //     try {
        //         const response = await api.get(`/albuns/${review.album_id}`);
        //         setReviewAlbum(response.data);
        //         // console.log("Feed data fetched successfully:", response.data);
        //         // console.log("total reviews:", feedData!.totalReviews);
        //     } catch (error) {
        //         console.error("Error fetching feed data:", error);
        //     } finally {
        //         setLoading(false);
        //     }
        // };

        console.log("Review data received in FeedCard:", review);

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

        // fetchFeedData();
        fetchContent();
    }, []);

    return (
        <Pressable
            onPress={() => router.push(`/review/${review.shorten}`)}
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
                {review.album ? (
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>
                            {review.Profile.name} avaliou {review.album.name} de{" "}
                            {review.album.artists
                                .map((artist) => artist.name)
                                .join(", ")}
                        </Text>
                        {content ? (
                            <>
                                {/* <TiptapRenderer json={content.jsonContent} /> */}
                                <EnrichedMarkdownText
                                    markdown={previewContent ? previewContent : ""}
                                    markdownStyle={{
                                        paragraph: {
                                            color: "#eee",
                                            fontSize: 14,
                                            marginTop: 4,
                                            lineHeight: 20,
                                        },
                                        h1: {
                                            color: "#eee",
                                            fontSize: 18,
                                            fontWeight: "bold",
                                            lineHeight: 24,
                                            marginTop: 8,
                                        },
                                        h2: {
                                            color: "#eee",
                                            fontSize: 16,
                                            fontWeight: "bold",
                                            marginTop: 4,
                                            lineHeight: 20,
                                        },
                                    }}
                                    //   onLinkPress={({ url }) => Linking.openURL(url)}
                                />
                                {isTruncated && (
                            <Text style={styles.readMore}>ler mais</Text>
                        )}
                            </>
                        ) : null}

                        <AlbumCard
                            image={review.album.images[0].url}
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
    readMore: {
        marginTop: 8,
        color: "#8065ef",
        fontSize: 14,
        fontWeight: "bold",
    },
});
