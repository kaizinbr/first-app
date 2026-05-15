import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { EnrichedMarkdownText } from "react-native-enriched-markdown";
import { truncateMarkdown } from "@/lib/util/truncate";

import TextDefault from "@/components/core/text-core";
import { authClient } from "@/lib/auth-client";
import { useRouter, Href, Link } from "expo-router";
import api from "@/lib/api";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { displayPastRelativeTime } from "@/lib/util/time";
import TiptapRenderer from "@/components/home/card-content copy";
import { AlbumCard } from "@/components/home/album-section";
import { ReviewWithAlbum } from "@/lib/types";
import LikeBtn from "@/components/core/like-btn";

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
import { DraftStorage, ReviewDraft } from "@/store/reviewSessionStore";

const MAX_PREVIEW_CHARS = 500;

export default function DraftCard({ draft }: { draft: ReviewDraft }) {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    // console.log("DraftCard renderizado com draft:", draft);

    const [albumData, setAlbumData] = useState<SpotifyAlbum | null>(null);
    const [content, setContent] = useState<{
        jsonContent: any;
        html: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    const previewContent = draft.reviewText
        ? truncateMarkdown(draft.reviewText, MAX_PREVIEW_CHARS)
        : null;

    const isTruncated = draft.reviewText
        ? draft.reviewText.length > MAX_PREVIEW_CHARS
        : false;

    useEffect(() => {
        const fecthAlbumData = async () => {
            try {
                const response = await api.get(`/albuns/${draft.albumId}`);
                setAlbumData(response.data);
                // console.log("Content fetched successfully:", content.html);
            } catch (error) {
                console.error("Error fetching content:", error);
            }
        };

        // fetchFeedData();
        fecthAlbumData();
    }, []);

    return (
        <Pressable
            onPress={() =>
                router.push({
                    pathname: "/(app)/create/review/tracks/[id]",
                    params: { id: draft.albumId },
                })
            }
            style={({ pressed }) => [
                styles.main,
                pressed && styles.mainPressed,
            ]}
        >
            <View style={styles.card}>
                {albumData ? (
                    <>
                        <View style={styles.cardContent}>
                            <TextDefault style={styles.cardTitle}>
                                {albumData.name} de{" "}
                                {albumData.artists
                                    .map((artist) => artist.name)
                                    .join(", ")}
                            </TextDefault>
                            <TextDefault style={styles.cardText}>
                                    {Object.keys(draft.ratings).length} músicas · nota {draft.overallRating}
                                </TextDefault>
                            {content ? (
                                <>
                                    <EnrichedMarkdownText
                                        markdown={
                                            previewContent ? previewContent : ""
                                        }
                                        markdownStyle={{
                                            paragraph: {
                                                color: "#fff",
                                                fontSize: 14,
                                                marginTop: 4,
                                                lineHeight: 20,
                                                fontFamily: "Walsheim",
                                                fontWeight: "400",
                                            },
                                            h1: {
                                                color: "#fff",
                                                fontSize: 18,
                                                fontWeight: "bold",
                                                lineHeight: 24,
                                                marginTop: 8,
                                            },
                                            h2: {
                                                color: "#fff",
                                                fontSize: 16,
                                                fontWeight: "bold",
                                                marginTop: 4,
                                                lineHeight: 20,
                                            },
                                        }}
                                    />
                                    {isTruncated && (
                                        <TextDefault style={styles.readMore}>
                                            ler mais
                                        </TextDefault>
                                    )}
                                </>
                            ) : null}

                            <TextDefault style={styles.cardMeta}>
                                Salvo em{" "}
                                    {new Date(draft.savedAt).toLocaleString("pt-BR", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                            </TextDefault>
                        </View>
                        <Image
                            source={{ uri: albumData?.images[0].url }}
                            style={styles.cardImage}
                        />
                    </>
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
        color: "#eee",
        flexDirection: "row",
        gap: 8,
        backgroundColor: "#1b1c1d",
        borderRadius: 12,
        padding: 16,
    },
    cardImage: {
        width: 100,
        height: 100,
        backgroundColor: "#bbb",
        borderRadius: 32 * 0.306,
        marginBottom: 8,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontWeight: 500,
        color: "#eee",
    },
    cardText: {
        // fontWeight: 500,
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

    cardMeta: {
        color: "#777",
        fontSize: 13,
    },
});
