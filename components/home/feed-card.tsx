import { Text, Image, View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import api from "@/lib/api";
import Markdown from "react-native-markdown-display";

import { useEffect, useState } from "react";
import { displayPastRelativeTime } from "@/lib/util/time";

type review = {
    id: string;
    created_at: Date;
    ratings: any;
    review: string | null;
    total: any;
    shorten: string | null;
    content: any;
    published: boolean;
    updated_at: Date;
    album_id: string | null;
    user_id: string | null;
    Profile: {
        id: string;
        username: string;
        name: string;
        lowername: string;
        bio: string | null;
        pronouns: string | null;
        site: string | null;
        color: string | null;
        created_at: Date;
        public: boolean;
        favorites: {}[];
        verified: boolean;
        avatar_url: string | null;
        albuns: any[];
        artists: any[];
        location: string | null;
    };
};

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

const revTeste: review = {
    id: "6a0b3cd4-15be-4749-b6c8-bda76613788f",
    ratings: [
        {
            id: "1EvcZCOORYZn479M1WbGFP",
            skip: false,
            value: 100,
            comment: "",
            favorite: false,
        },
    ],
    review: "lindo e triste",
    total: "100",
    shorten: "ftTC9PDF69",
    content: {
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [
                    {
                        text: "lindo e triste",
                        type: "text",
                    },
                ],
            },
        ],
    },
    published: true,
    created_at: new Date("2026-02-13T14:32:55.937Z"),
    updated_at: new Date("2026-02-13T14:32:55.937Z"),
    album_id: "0RUo3HqDbrgs2AZlpVc616",
    user_id: "a0a35cfd-1f73-457d-ae09-1b0a636eff32",
    Profile: {
        id: "a0a35cfd-1f73-457d-ae09-1b0a636eff32",
        username: "kako",
        name: "kako triste",
        lowername: "kako",
        bio: "Bio",
        pronouns: "ele, nunca dele",
        site: null,
        color: "",
        created_at: new Date("2025-02-01T16:30:00.000Z"),
        public: true,
        favorites: [
            {
                albuns: [
                    {
                        id: "1FwFdMp4ewxTlLSudNzlyG",
                        src: "https://i.scdn.co/image/ab67616d000048515e3b76cd24496147ec236b6a",
                        title: "The Star Chapter: TOGETHER",
                        artist: "TOMORROW X TOGETHER",
                    },
                    {
                        id: "5BeSpFkdJkSc9phzT3bJSs",
                        src: "https://i.scdn.co/image/ab67616d00004851bc23afc74585dc9ea1ae22c3",
                        title: "Love Language",
                        artist: "TOMORROW X TOGETHER",
                    },
                    {
                        id: "5BenIQ2E8TFdZoAtPjUP9a",
                        src: "https://i.scdn.co/image/ab67616d000048513533ec688f7b48a135fd1e47",
                        title: "Only cry in the rain",
                        artist: "CHUU",
                    },
                    {
                        id: "72JboNccBYyXR676YNfcYE",
                        src: "https://i.scdn.co/image/ab67616d00004851b612b8d797e8e3ec375ca60d",
                        title: "The Star Chapter: SANCTUARY",
                        artist: "TOMORROW X TOGETHER",
                    },
                    {
                        id: "1Td1oiZTQFYR7N1QX00uhr",
                        src: "https://i.scdn.co/image/ab67616d00004851e4f5675b69f75a4ff99302f0",
                        title: "What A Devastating Turn of Events",
                        artist: "Rachel Chinouriri",
                    },
                ],
                artists: [],
            },
        ],
        verified: true,
        avatar_url:
            "https://zf4goehfa7fevldb.public.blob.vercel-storage.com/avatar/a0a35cfd-1f73-457d-ae09-1b0a636eff32_1769542851254.webp",
        albuns: [
            {
                id: "5Zdr9vactwnJH4Vpe9Mid9",
                src: "https://i.scdn.co/image/ab67616d00004851253a9c74941281b0407ce940",
                title: "The Chaos Chapter: FREEZE",
                artist: "TOMORROW X TOGETHER",
            },
            {
                id: "1KerGJUScYGffP3Mjmjz8c",
                src: "https://i.scdn.co/image/ab67616d000048515945e0dce1af45d640cf06ea",
                title: "K-12",
                artist: "Melanie Martinez",
            },
            {
                id: "2DVwOWSHjIm1L6pOm0EGIl",
                src: "https://i.scdn.co/image/ab67616d00004851190aaad879fd91cebab37efd",
                title: "Esquinas",
                artist: "ANAVITÓRIA",
            },
            {
                id: "0cdntdbjR5jgoKaIHSXJuK",
                src: "https://i.scdn.co/image/ab67616d00004851e8336e9e3be421d2293a8926",
                title: "CARRANCA",
                artist: "Urias",
            },
            {
                id: "1Td1oiZTQFYR7N1QX00uhr",
                src: "https://i.scdn.co/image/ab67616d00004851e4f5675b69f75a4ff99302f0",
                title: "What A Devastating Turn of Events",
                artist: "Rachel Chinouriri",
            },
        ],
        artists: [
            {
                id: "0ghlgldX5Dd6720Q3qFyQB",
                src: "https://i.scdn.co/image/ab6761610000f1781c81416bbbfe539adb9d7050",
                name: "TOMORROW X TOGETHER",
            },
            {
                id: "66CXWjxzNUsdJxJ2JdwvnR",
                src: "https://i.scdn.co/image/ab6761610000f1786725802588d7dc1aba076ca5",
                name: "Ariana Grande",
            },
        ],
        location: null,
    },
};

export default function FeedCard({ review }: { review: review }) {
    const { data: session } = authClient.useSession();

    const [reviewAlbum, setReviewAlbum] = useState<SpotifyAlbum | null>(null);
    const [content, setContent] = useState<{
        jsonContent: any;
        html: string;
        markdown: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedData = async () => {
            try {
                const response = await api.get(`/album/${review.album_id}`);
                setReviewAlbum(response.data);
                // console.log("Feed data fetched successfully:", response.data);
                // console.log("total reviews:", feedData!.totalReviews);
            } catch (error) {
                console.error("Error fetching feed data:", error);
            } finally {
                setLoading(false);
            }
        };

        const fecthContent = async () => {
            try {
                const response = await api.get(
                    `/review/content/${review.shorten}`,
                );
                setContent(response.data);
            } catch (error) {
                console.error("Error fetching content:", error);
            }
        };

        fetchFeedData();
        fecthContent();
    }, []);

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >

            <View style={styles.card}>
                <View style={styles.cardImage}></View>
                {reviewAlbum ? (
                    <View style={styles.cardContent}>
                        <Text>
                            {review.Profile.name} avaliou {reviewAlbum.name} de{" "}
                            {reviewAlbum.artists
                                .map((artist) => artist.name)
                                .join(", ")}
                        </Text>
                        {content ? (
                            <>
                                <Text>Conteúdo em markdown:</Text>
                                <Markdown>{content.markdown}</Markdown>
                            </>
                        ) : (
                            <Text>Carregando conteúdo...</Text>
                        )}

                        <View style={styles.albumSection}>
                            {reviewAlbum ? (
                                <>
                                    <Image
                                        source={{
                                            uri: reviewAlbum.images[0].url,
                                        }}
                                        style={{
                                            width: 124,
                                            height: 124,
                                            borderRadius: 8,
                                        }}
                                    />
                                    <View style={{ marginLeft: 12 }}>
                                        <Text style={{ fontWeight: "bold" }}>
                                            {Number(
                                                Number(review.total),
                                            ).toFixed(1)}
                                            /100
                                        </Text>
                                        <Text>
                                            {review.ratings.length} músicas
                                            avaliadas
                                        </Text>
                                    </View>
                                </>
                            ) : (
                                <Text>Carregando álbum...</Text>
                            )}
                        </View>
                        <Text>
                            {displayPastRelativeTime(
                                new Date(review.created_at),
                            )}
                        </Text>
                    </View>
                ) : null}
            </View>

            {/* <View style={styles.feed}>
                {loading ? (
                    <Text>Carregando avaliações...</Text>
                ) : reviewAlbum ? (
                    <View style={styles.feedCard}>
                        <Text>{reviewAlbum.name}</Text>
                    </View>
                ) : (
                    <Text>Álbum não encontrado</Text>
                )}
            </View> */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: "#fff",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 16,
    },
    main: {
        flex: 1,
        backgroundColor: "#fff",
        width: "100%",
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        textAlign: "left",
        marginTop: 32,
    },
    h2: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "left",
        marginTop: 32,
    },
    feed: {
        gap: 8,
        marginTop: 20,
    },
    feedCard: {
        height: 120,
        width: "100%",
        backgroundColor: "#eee",
        borderRadius: 8,
    },
    image: {
        width: "100%",
        height: 300,
        marginTop: 20,
        resizeMode: "contain",
    },
    banner: {
        flexDirection: "row",
        gap: 8,
        marginTop: 20,
        height: 120,
    },
    bannerCard: {
        height: 120,
        width: 120,
        backgroundColor: "#eee",
        borderRadius: 8,
    },

    card: {
        width: "100%",
        backgroundColor: "#ddd",
        padding: 12,
        borderRadius: 8,
        flexDirection: "row",
        gap: 8,
    },
    cardImage: {
        width: 32,
        height: 32,
        backgroundColor: "#bbb",
        borderRadius: 6,
        marginBottom: 8,
    },
    cardContent: {
        flex: 1,
    },
    albumSection: {

    }
});
