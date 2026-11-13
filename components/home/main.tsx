import FeedCard from "@/components/home/feed-card";
import { useEffect, useRef, useState, useCallback } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    RefreshControl,
    Platform,
} from "react-native";
import { usePaginatedReviews } from "@/lib/util/usePaginatedReviews";
import TextDefault from "@/components/core/text-core";
import FeedHeader from "@/components/home/header";
import Animated from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SkeletonFeedCard } from "@/components/core/skeletons";

interface FeedProps {
    onScrollAnimado: any;
    scrollOffsetY: SharedValue<number>;
    animatedRef: any;
}

export default function HomePage({
    onScrollAnimado,
    scrollOffsetY,
    animatedRef,
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

    

    // const reviews = [];
    const insets = useSafeAreaInsets();

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await reload();
        setRefreshing(false);
    }, []);

    // if (loadingInitial) {
    //     return (
    //         <View
    //             style={[
    //                 styles.container,
    //                 { justifyContent: "center", alignItems: "center" },
    //             ]}
    //         >
    //             <ActivityIndicator size="large" color="#8065ef" />
    //         </View>
    //     );
    // }

    return (
        <Animated.FlatList
            ref={animatedRef}
            style={styles.container}
            contentContainerStyle={styles.feed}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            data={reviews}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <FeedCard
                    review={item}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                />
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            onMomentumScrollBegin={onMomentumScrollBegin}
            onScroll={onScrollAnimado}
            scrollEventThrottle={16}
            ListHeaderComponent={() => (
                <FeedHeader scrollOffsetY={scrollOffsetY} />
            )}
            ItemSeparatorComponent={() => (
                <View
                    style={{
                        height: 0.5,
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            height: 0.5,
                            backgroundColor: "#3d3d3d",
                            width: "95%",
                        }}
                    />
                </View>
            )}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    progressViewOffset={
                        Platform.OS === "android" ? 24 + insets.top : 0
                    }
                    progressBackgroundColor="#282828"
                    colors={["#8065ef", "#8065ef"]}
                    style={{
                        borderWidth: 0.5,
                        borderColor: "#56595D",
                    }}
                />
            }
            ListFooterComponent={
                loadingMore ? (
                    <ActivityIndicator
                        size="small"
                        color="#8065ef"
                        style={{ marginTop: 20 }}
                    />
                ) : (
                    <TextDefault
                        style={{
                            color: "#777",
                            textAlign: "center",
                            marginTop: 20,
                        }}
                    >
                        Você chegou ao fim!
                    </TextDefault>
                )
            }
            ListEmptyComponent={
                <>
                    <TextDefault style={{ color: "#eee", textAlign: "center" }}>
                        Nenhuma avaliação encontrada.
                    </TextDefault>
                    {/* <SkeletonFeedCard /> */}
                </>
            }
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, width: "100%" },
    feed: { paddingBottom: 64 },
});
