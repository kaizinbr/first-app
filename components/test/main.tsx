import FeedCard from "@/components/test/feed-card";
import { useEffect, useRef, useState, useCallback } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    RefreshControl,
} from "react-native";
import { usePaginatedReviews } from "@/lib/util/usePaginatedReviews";
import TextDefault from "@/components/core/text-core";
import FeedHeader from "@/components/test/header";
import Animated from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";

interface FeedProps {
    onScrollAnimado: any;
    scrollOffsetY: SharedValue<number>;
}

export default function HomePage({
    onScrollAnimado,
    scrollOffsetY,
}: FeedProps) {
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
                <ActivityIndicator size="large" color="#8065ef" />
                <TextDefault style={{ color: "#eee", marginTop: 10 }}>
                    Carregando feed...
                </TextDefault>
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
            ListHeaderComponent={() => (
                <FeedHeader scrollOffsetY={scrollOffsetY} />
            )}
            ItemSeparatorComponent={() => (
                <View style={{ height: 0.5, backgroundColor: "#3d3d3d" }} />
            )}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListFooterComponent={
                loadingMore ? (
                    <ActivityIndicator
                        size="small"
                        color="#8065ef"
                        style={{ marginTop: 20 }}
                    />
                ) : !hasMore && reviews.length > 0 ? (
                    <TextDefault
                        style={{
                            color: "#777",
                            textAlign: "center",
                            marginTop: 20,
                        }}
                    >
                        Você chegou ao fim!
                    </TextDefault>
                ) : null
            }
            ListEmptyComponent={
                <TextDefault style={{ color: "#eee", textAlign: "center" }}>
                    Nenhuma avaliação encontrada.
                </TextDefault>
            }
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, width: "100%" },
    feed: { paddingBottom: 56 },
});
