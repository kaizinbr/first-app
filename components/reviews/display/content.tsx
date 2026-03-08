import FeedCard from "@/components/home/feed-card";
import api from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Review } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
    Animated
} from "react-native";

interface FeedProps {
    onScrollAnimado: any; 
}
export default function PageContent({ onScrollAnimado }: FeedProps) {
    const { data: session } = authClient.useSession();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const isFetching = useRef(false);
    const onEndReachedCalledDuringMomentum = useRef(true);
    const hasMoreRef = useRef(true);
    const nextPageRef = useRef(1);
    const requestedPagesRef = useRef(new Set<number>());
    const loadedIdsRef = useRef(new Set<Review["id"]>());
    const mountedRef = useRef(true);

    const updateHasMore = (value: boolean) => {
        hasMoreRef.current = value;
        setHasMore(value);
    };

    useEffect(() => {
        void fetchPage(1, true);

        return () => {
            mountedRef.current = false;
        };
    }, []);


    const fetchPage = async (pageNumber: number, replace = false) => {
        if (isFetching.current) return;
        if (!replace && !hasMoreRef.current) return;
        if (!replace && requestedPagesRef.current.has(pageNumber)) return;

        requestedPagesRef.current.add(pageNumber);
        isFetching.current = true;

        console.log(`Fetching page ${pageNumber}...`);

        if (replace) {
            setLoadingInitial(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const response = await api.get(`/reviews?p=${pageNumber}`);
            console.log(`Fetched page ${pageNumber}`);
            const payload = response.data;
            const incomingReviews: Review[] = Array.isArray(payload?.reviews)
                ? payload.reviews
                : Array.isArray(payload)
                  ? payload
                  : [];

            if (!mountedRef.current) return;

            if (replace) {
                loadedIdsRef.current.clear();
                requestedPagesRef.current.clear();
                requestedPagesRef.current.add(1);
                updateHasMore(true);
            }

            const uniqueReviews: Review[] = [];
            for (const review of incomingReviews) {
                if (!loadedIdsRef.current.has(review.id)) {
                    loadedIdsRef.current.add(review.id);
                    uniqueReviews.push(review);
                }
            }

            if (replace) {
                setReviews(uniqueReviews);
            } else if (uniqueReviews.length > 0) {
                setReviews((prevReviews) => [...prevReviews, ...uniqueReviews]);
            }

            if (
                incomingReviews.length === 0 ||
                (!replace && uniqueReviews.length === 0)
            ) {
                updateHasMore(false);
                return;
            }

            nextPageRef.current = pageNumber + 1;
        } catch (error) {
            requestedPagesRef.current.delete(pageNumber);
            console.error("Error fetching feed data:", error);
        } finally {
            if (!mountedRef.current) return;

            setLoadingInitial(false);
            setLoadingMore(false);
            isFetching.current = false;
        }
    };

    const loadMore = () => {
        if (onEndReachedCalledDuringMomentum.current) return;
        if (
            !hasMoreRef.current ||
            loadingInitial ||
            loadingMore ||
            isFetching.current
        ) {
            return;
        }

        onEndReachedCalledDuringMomentum.current = true;
        void fetchPage(nextPageRef.current);
    };

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
            contentContainerStyle={[styles.feed, { paddingTop: 374 }]} 
            
            showsVerticalScrollIndicator={false}
            data={reviews}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <FeedCard review={item} />}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum.current = false;
            }}
            
            onScroll={onScrollAnimado}
            scrollEventThrottle={16} 
            
            ListHeaderComponent={<Text style={styles.h2}>Avaliações</Text>}
            ListFooterComponent={
                loadingMore ? (
                    <ActivityIndicator
                        size="small"
                        color="#00a8ff"
                        style={{ marginTop: 20, paddingBottom: 60 }}
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
    container: {
        flex: 1,
        width: "100%",
    },
    h2: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "left",
        marginTop: 32,
        marginBottom: 16,
        color: "#eeeeee",
        paddingHorizontal: 16,
    },
    feed: {
        paddingBottom: 56,
    },
});
