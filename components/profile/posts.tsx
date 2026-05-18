import {
    View,
    Text,
    Image,
    Button,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Pressable,
} from "react-native";
import TextDefault from "@/components/core/text-core";
import { UserProfile, ReviewWithAlbum } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";
import api, { apiAuth } from "@/lib/api";
import { Tabs } from "react-native-collapsible-tab-view";
import { ActivityIndicator } from "react-native";
import FeedCard from "@/components/home/feed-card";
import { usePaginatedReviews } from "@/lib/util/usePaginatedReviews";
import { SortFromTopToBottom, SortFromBottomToTop  } from '@solar-icons/react-native/Bold'

export default function PostsRoute({ data }: { data: UserProfile }) {
    const [sort, setSort] = useState<"asc" | "desc">("desc");
    const {
        reviews,
        loadingInitial,
        loadingMore,
        hasMore,
        loadMoreForTabs,
        reload,
    } = usePaginatedReviews({
        endpoint: `/users/${data.username}/reviews`,
        data,
        sort,
    });

    const ItemSeparator = () => {
        return <View style={styles.separator} />;
    };

    const [refreshing, setRefreshing] = useState(false);

    const [localReviews, setLocalReviews] = useState(reviews);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await reload();
        setRefreshing(false);
    }, []);

    const handleScroll = useCallback(
        (event: any) => {
            const { layoutMeasurement, contentOffset, contentSize } =
                event.nativeEvent;
            const distanceFromEnd =
                contentSize.height - layoutMeasurement.height - contentOffset.y;
            if (distanceFromEnd < 300) {
                loadMoreForTabs();
            }
        },
        [loadMoreForTabs],
    );

    useEffect(() => {
        setLocalReviews(reviews);
    }, [reviews]);

    const onDelete = useCallback((id: string) => {
        setLocalReviews((prev) => prev.filter((r) => r.id !== id));
    }, []);

    return (
        <Tabs.FlatList
            data={reviews}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <FeedCard review={item} onRefresh={onRefresh} />
            )}
            ItemSeparatorComponent={ItemSeparator}
            onEndReached={() => {
                console.log("onEndReached fired");
                loadMoreForTabs();
            }}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{
                paddingBottom: 80,
                flexGrow: 1,
                width: "100%",
                // backgroundColor: "red",
            }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
                <View style={{ flexDirection: "row", padding: 12, gap: 8 }}>
                    <Pressable
                        style={[
                            styles.sortBtn,
                            sort === "desc" && styles.sortBtnActive,
                        ]}
                        onPress={() => setSort("desc")}
                    >
                        <SortFromBottomToTop size={16} color={sort === "desc" ? "#8065ef" : "#777"} />
                        <TextDefault style={styles.sortText}>
                            Mais recentes
                        </TextDefault>
                    </Pressable>
                    <Pressable
                        style={[
                            styles.sortBtn,
                            sort === "asc" && styles.sortBtnActive,
                        ]}
                        onPress={() => setSort("asc")}
                    >
                        <SortFromTopToBottom size={16} color={sort === "asc" ? "#8065ef" : "#777"} />
                        <TextDefault style={styles.sortText}>
                            Mais antigas
                        </TextDefault>
                    </Pressable>
                </View>
            )}
            ListFooterComponent={
                loadingMore ? (
                    <ActivityIndicator
                        size="small"
                        color="#00a8ff"
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
                        Fim!
                    </TextDefault>
                ) : null
            }
            ListEmptyComponent={
                loadingInitial ? (
                    <ActivityIndicator
                        size="large"
                        color="#8065ef"
                        style={{ marginTop: 40 }}
                    />
                ) : (
                    <TextDefault
                        style={{
                            color: "#eee",
                            textAlign: "center",
                            marginTop: 40,
                        }}
                    >
                        Nenhuma avaliação ainda.
                    </TextDefault>
                )
            }
        />
    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,

        gap: 16,
        width: "100%",
    },
    separator: {
        height: 1,
        backgroundColor: "#333", // Uma cor cinza escura sutil que combina com seu modo dark
        marginVertical: 4, // O espaço entre o separador e os posts
    },
    textDefault: {
        color: "#eee", // A cor clara para o seu modo escuro
        fontSize: 16,
    },
    sortBtn: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 32,
        // backgroundColor: "#282828",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderColor: "#282828",
        borderWidth: 1,
    },
    sortBtnActive: {
        backgroundColor: "#282828",
    },
    sortText: {
        color: "#eee",
        fontSize: 12,
    },
});
