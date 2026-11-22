import FeedCard from "@/components/home/feed-card";
import {
    ActivityIndicator,
    StyleSheet,
    View,
    RefreshControl,
    Platform,
} from "react-native";
import { useReviews } from "@/lib/queries/review";
import TextDefault from "@/components/core/text-core";
import FeedHeader from "@/components/home/header";
import Animated from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isRefetching,
        refresh,
    } = useReviews({ endpoint: "/reviews" });
    console.log("Data from useReviews:", hasNextPage);

    const reviews = data?.pages?.flatMap((page: any) => page.reviews ?? []) ?? [];
    const refreshing = isRefetching && !isFetchingNextPage;
    const insets = useSafeAreaInsets();

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
                    onRefresh={() => refresh()}
                    refreshing={refreshing}
                    type="list"
                />
            )}
            onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.2}
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
                    onRefresh={() => {
                        void refresh();
                    }}
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
                isFetchingNextPage ? (
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
                <TextDefault style={{ color: "#eee", textAlign: "center" }}>
                    Nenhuma avaliação encontrada.
                </TextDefault>
            }
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, width: "100%" },
    feed: { paddingBottom: 64 },
});