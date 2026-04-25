import FeedCard from "@/components/home/feed-card";
import api from "@/lib/api";
import { ReviewWithAlbum } from "@/lib/types";
import { useEffect, useRef, useState, useCallback } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
    Animated,
    RefreshControl
} from "react-native";
import { usePaginatedReviews } from "@/lib/util/usePaginatedReviews";

import FeedHeader from "@/components/home/header";

interface FeedProps {
    onScrollAnimado: any;
    scrollOffsetY: Animated.Value;
}

export default function Feed({ onScrollAnimado, scrollOffsetY }: FeedProps) {
    const {
        reviews,
        loadingInitial,
        loadingMore,
        hasMore,
        reload,
        loadMore,
        onMomentumScrollBegin,
    } = usePaginatedReviews({ endpoint: "/reviews" });

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await reload();
        setRefreshing(false);
    }, []);

    if (loadingInitial) {
        return (
            <View
                style={[
                    styles.container,
                    { justifyContent: "center", alignItems: "center" },
                ]}
            >
                <ActivityIndicator size="large" color="#00a8ff" />
                <Text style={{ color: "#eee", marginTop: 10 }}>
                    Carregando feed...
                </Text>
            </View>
        );
    }


    return (
        <Animated.FlatList
            style={styles.container}
            contentContainerStyle={styles.feed}
            showsVerticalScrollIndicator={false}
            data={reviews}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <FeedCard review={item} />}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            onMomentumScrollBegin={onMomentumScrollBegin}
            onScroll={onScrollAnimado}
            scrollEventThrottle={16}
            ListHeaderComponent={<FeedHeader scrollOffsetY={scrollOffsetY} />}
            ItemSeparatorComponent={() => (
                <View
                    style={{
                        height: 0.5,
                        backgroundColor: "#3d3d3d",
                        // marginVertical: 10,
                    }}
                />
            )}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            ListFooterComponent={
                loadingMore ? (
                    <ActivityIndicator
                        size="small"
                        color="#00a8ff"
                        style={{ marginTop: 20 }}
                    />
                ) : !hasMore && reviews.length > 0 ? (
                    <Text
                        style={{
                            color: "#777",
                            textAlign: "center",
                            marginTop: 20,
                        }}
                    >
                        Você chegou ao fim!
                    </Text>
                ) : null
            }
            ListEmptyComponent={
                <Text style={{ color: "#eee", textAlign: "center" }}>
                    Nenhuma avaliação encontrada.
                </Text>
            }
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, width: "100%" },
    headerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 16,
        marginBottom: 80,
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        color: "#eeeeee",
        paddingHorizontal: 16,
        marginTop: 24,
    },
    feed: { paddingBottom: 56 },
    h2: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "left",
        marginTop: 32,
        marginBottom: 16,
        color: "#eeeeee",
        paddingHorizontal: 16,
    },
});

// o spotify tem umas conversa vea torta de remover a função de puxar varios albuns ao mesmo tempo
// entao essa é a versão que cada album é carregado individualmente da api, pode dar erro de sobrecarga entao é limitado a 5 por vez

// feed.tsx
// import FeedCard from "@/components/home/feed-card";
// import api from "@/lib/api";
// import { Review } from "@/lib/types";
// import { useEffect, useRef, useState } from "react";
// import {
//     ActivityIndicator,
//     FlatList,
//     StyleSheet,
//     Text,
//     View,
//     Animated,
// } from "react-native";

// import FeedHeader from "@/components/home/header";

// interface FeedProps {
//     onScrollAnimado: any;
//     activeColor: string;
//     onColorChange: (color: string) => void;
//     scrollOffsetY: Animated.Value;
// }

// export default function Feed({
//     onScrollAnimado,
//     activeColor,
//     onColorChange,
//     scrollOffsetY,
// }: FeedProps) {
//     const [reviews, setReviews] = useState<Review[]>([]);
//     const [loadingInitial, setLoadingInitial] = useState(true);
//     const [loadingMore, setLoadingMore] = useState(false);
//     const [hasMore, setHasMore] = useState(true);

//     const isFetching = useRef(false);
//     const onEndReachedCalledDuringMomentum = useRef(true);
//     const hasMoreRef = useRef(true);
//     const nextPageRef = useRef(1);
//     const requestedPagesRef = useRef(new Set<number>());
//     const loadedIdsRef = useRef(new Set<Review["id"]>());
//     const mountedRef = useRef(true);

//     const updateHasMore = (value: boolean) => {
//         hasMoreRef.current = value;
//         setHasMore(value);
//     };

//     useEffect(() => {
//         void fetchPage(1, true);
//         return () => { mountedRef.current = false; };
//     }, []);

//     const fetchPage = async (pageNumber: number, replace = false) => {
//         if (isFetching.current) return;
//         if (!replace && !hasMoreRef.current) return;
//         if (!replace && requestedPagesRef.current.has(pageNumber)) return;

//         requestedPagesRef.current.add(pageNumber);
//         isFetching.current = true;

//         // if (replace) setLoadingInitial(true);
//         // else setLoadingMore(true);

//         try {
//             const response = await api.get(`/reviews?p=${pageNumber}`);
//             const payload = response.data;
//             const incomingReviews: Review[] = Array.isArray(payload?.reviews)
//                 ? payload.reviews
//                 : Array.isArray(payload) ? payload : [];

//             if (!mountedRef.current) return;

//             if (replace) {
//                 loadedIdsRef.current.clear();
//                 requestedPagesRef.current.clear();
//                 requestedPagesRef.current.add(1);
//                 updateHasMore(true);
//             }

//             const uniqueReviews: Review[] = [];
//             for (const review of incomingReviews) {
//                 if (!loadedIdsRef.current.has(review.id)) {
//                     loadedIdsRef.current.add(review.id);
//                     uniqueReviews.push(review);
//                 }
//             }

//             if (replace) setReviews(uniqueReviews);
//             else if (uniqueReviews.length > 0) {
//                 setReviews((prev) => [...prev, ...uniqueReviews]);
//             }

//             if (incomingReviews.length === 0 || (!replace && uniqueReviews.length === 0)) {
//                 updateHasMore(false);
//                 return;
//             }

//             nextPageRef.current = pageNumber + 1;
//         } catch (error) {
//             requestedPagesRef.current.delete(pageNumber);
//             console.error("Error fetching feed data:", error);
//         } finally {
//             if (!mountedRef.current) return;
//             setLoadingInitial(false);
//             setLoadingMore(false);
//             isFetching.current = false;
//         }
//     };

//     const loadMore = () => {
//         if (onEndReachedCalledDuringMomentum.current) return;
//         if (!hasMoreRef.current || loadingInitial || loadingMore || isFetching.current) return;
//         onEndReachedCalledDuringMomentum.current = true;
//         void fetchPage(nextPageRef.current);
//     };

//     if (loadingInitial) {
//         return (
//             <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
//                 <ActivityIndicator size="large" color="#00a8ff" />
//                 <Text style={{ color: "#eee", marginTop: 10 }}>Carregando feed...</Text>
//             </View>
//         );
//     }

//     return (
//         <Animated.FlatList
//             style={styles.container}
//             contentContainerStyle={styles.feed}
//             showsVerticalScrollIndicator={false}
//             data={reviews}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={({ item }) => <FeedCard review={item} />}
//             onEndReached={loadMore}
//             onEndReachedThreshold={0.2}
//             onMomentumScrollBegin={() => {
//                 onEndReachedCalledDuringMomentum.current = false;
//             }}
//             onScroll={onScrollAnimado}
//             scrollEventThrottle={16}
//             ListHeaderComponent={
//                 <FeedHeader
//                     activeColor={activeColor}
//                     onColorChange={onColorChange}
//                     scrollOffsetY={scrollOffsetY}
//                 />
//             }
//             ListFooterComponent={
//                 loadingMore ? (
//                     <ActivityIndicator size="small" color="#00a8ff" style={{ marginTop: 20 }} />
//                 ) : !hasMore && reviews.length > 0 ? (
//                     <Text style={{ color: "#777", textAlign: "center", marginTop: 20 }}>
//                         Você chegou ao fim!
//                     </Text>
//                 ) : null
//             }
//             ListEmptyComponent={
//                 <Text style={{ color: "#eee", textAlign: "center" }}>
//                     Nenhuma avaliação encontrada.
//                 </Text>
//             }
//         />
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, width: "100%" },
//     headerContent: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "flex-start",
//         gap: 16,
//         marginBottom: 80,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: "800",
//         color: "#eeeeee",
//         paddingHorizontal: 16,
//         marginTop: 24,
//     },
//     feed: { paddingBottom: 56 },
//     h2: {
//         fontSize: 18,
//         fontWeight: "600",
//         textAlign: "left",
//         marginTop: 32,
//         marginBottom: 16,
//         color: "#eeeeee",
//         paddingHorizontal: 16,
//     },
// });

// feed-card.tsx
// import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { authClient } from "@/lib/auth-client";
// import { useRouter, Href, Link } from "expo-router";
// import api from "@/lib/api";
// import { Image } from "expo-image";
// import { useEffect, useState } from "react";
// import { displayPastRelativeTime } from "@/lib/util/time";
// import TiptapRenderer from "@/components/home/card-content copy";
// import { AlbumCard } from "@/components/home/album-section";
// import { Review } from "@/lib/types";

// type SpotifyAlbum = {
//     album_type: string;
//     total_tracks: number;
//     available_markets: string[];
//     external_urls: {
//         spotify: string;
//     };
//     href: string;
//     id: string;
//     images: Array<{
//         url: string;
//         height: number;
//         width: number;
//     }>;
//     name: string;
//     release_date: string;
//     release_date_precision: string;
//     type: string;
//     uri: string;
//     artists: {
//         id: string;
//         name: string;
//     }[];
//     tracks: Record<string, unknown>;
//     copyrights: unknown[];
//     external_ids: {
//         upc: string;
//     };
//     genres: string[];
//     label: string;
//     popularity: number;
// };

// export default function FeedCard({ review }: { review: Review }) {

//         const router = useRouter();
//     const { data: session } = authClient.useSession();

//     const [reviewAlbum, setReviewAlbum] = useState<SpotifyAlbum | null>(null);
//     const [content, setContent] = useState<{
//         jsonContent: any;
//         html: string;
//     } | null>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchFeedData = async () => {
//             try {
//                 const response = await api.get(`/albuns/${review.album_id}`);
//                 setReviewAlbum(response.data);
//                 // console.log("Feed data fetched successfully:", response.data);
//                 // console.log("total reviews:", feedData!.totalReviews);
//             } catch (error) {
//                 console.error("Error fetching feed data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const fetchContent = async () => {
//             if (!review.shorten) {
//                 console.error("Review shorten is undefined");
//                 return;
//             }

//             if (
//                 !Array.isArray(review.content.content) ||
//                 review.content.content.length === 0 ||
//                 !Array.isArray(review.content.content[0].content) ||
//                 review.content.content[0].content.length === 0 ||
//                 review.content.content[0].content[0].text === ""
//             ) {
//                 console.warn("Review content is empty");
//                 return;
//             }

//             try {
//                 const response = await api.get(
//                     `/reviews/${review.shorten}/content`,
//                 );
//                 setContent(response.data);
//                 // console.log("Content fetched successfully:", content.html);
//             } catch (error) {
//                 console.error("Error fetching content:", error);
//             }
//         };

//         fetchFeedData();
//         fetchContent();
//     }, []);

//     return (
//         <Pressable
//             onPress={() => router.push(`/review/${review.shorten}`)}
//             style={({ pressed }) => [
//                 styles.main,
//                 pressed && styles.mainPressed,
//             ]}
//         >
//             <View style={styles.card}>
//                 <Image
//                     source={{ uri: review.Profile.avatar_url! }}
//                     style={styles.cardImage}
//                 />
//                 {reviewAlbum ? (
//                     <View style={styles.cardContent}>
//                         <Text style={styles.cardTitle}>
//                             {review.Profile.name} avaliou {reviewAlbum.name} de{" "}
//                             {reviewAlbum.artists
//                                 .map((artist) => artist.name)
//                                 .join(", ")}
//                         </Text>
//                         {content ? (
//                             <>
//                                 <TiptapRenderer json={content.jsonContent} />
//                             </>
//                         ) : null}

//                         <AlbumCard
//                             image={reviewAlbum.images[0].url}
//                             value={
//                                 review.total
//                                     ? `${Number(review.total).toFixed(1)}/100`
//                                     : "0.0/100"
//                             }
//                             subtitle={review.ratings.length}
//                         />
//                         <Text style={styles.cardDate}>
//                             {displayPastRelativeTime(
//                                 new Date(review.created_at),
//                             )}
//                         </Text>
//                     </View>
//                 ) : null}
//             </View>
//         </Pressable>
//     );
// }

// const styles = StyleSheet.create({
//     main: {
//         width: "100%",
//         backgroundColor: "transparent",
//         borderRadius: 8,
//     },
//     mainPressed: {
//         backgroundColor: "#1e1e1e",
//     },
//     card: {
//         width: "100%",
//         backgroundColor: "transparent",
//         color: "#eee",
//         padding: 16,
//         borderRadius: 8,
//         flexDirection: "row",
//         gap: 8,
//     },
//     cardImage: {
//         width: 32,
//         height: 32,
//         backgroundColor: "#bbb",
//         borderRadius: 32 * 0.306,
//         marginBottom: 8,
//     },
//     cardContent: {
//         flex: 1,
//     },
//     cardTitle: {
//         fontWeight: "bold",
//         color: "#eee",
//     },
//     albumSection: {
//         flexDirection: "row",
//         alignItems: "flex-start",
//         marginTop: 12,
//         color: "#eee",
//         padding: 12,
//         backgroundColor: "#1e1e1e",
//         borderRadius: 8,
//         borderColor: "#333",
//         borderWidth: 0.5,
//     },
//     albumSectionValue: {
//         fontWeight: 900,
//         color: "#eee",
//         fontSize: 20,
//     },
//     albumSectionText: {
//         color: "#eee",
//         fontSize: 12,
//         marginTop: 6,
//     },
//     cardDate: {
//         marginTop: 8,
//         color: "#aaa",
//         fontSize: 12,
//     },
// });
