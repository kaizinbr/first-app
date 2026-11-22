import {
    View,
    StyleSheet,
    Pressable,
    ActivityIndicator,
    RefreshControl,
    Platform,
} from "react-native";
import TextDefault from "@/components/core/text-core";
import { UserProfile } from "@/lib/types";
import { useState } from "react";
import { Tabs } from "react-native-collapsible-tab-view";
import FeedCard from "@/components/home/feed-card";
import { useReviews } from "@/lib/queries/review";

import { SortFromTopToBottomIcon } from "@solar-icons/react-native/bold/sort-from-top-to-bottom";
import { SortFromBottomToTopIcon } from "@solar-icons/react-native/bold/sort-from-bottom-to-top";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { WidgetIcon } from "@solar-icons/react-native/bold/widget";

export default function PostsRoute({ data }: { data: UserProfile }) {
    const insets = useSafeAreaInsets();

    const [sort, setSort] = useState<"asc" | "desc">("desc");
    const [type, setType] = useState<"grid" | "list">("list");
    const {
        data: pages,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isRefetching,
        refetch,
    } = useReviews({
        endpoint: `/users/${data.username}/reviews`,
        sort,
    });

    const reviews = pages?.pages.flatMap((page) => page.reviews) ?? [];
    const refreshing = isRefetching && !isFetchingNextPage;

    return (
        <Tabs.FlatList
            style={styles.container}
            contentContainerStyle={{
                paddingBottom: 80,
                // flexGrow: 1,
                width: "100%",
                flexDirection: type === "grid" ? "row" : "column",
                flexWrap: type === "grid" ? "wrap" : "nowrap",
                gap: 8,
                // backgroundColor: "red",
                paddingHorizontal: type === "grid" ? 16 : 0,
            }}
            data={reviews}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <FeedCard
                    review={item}
                    onRefresh={() => refetch()}
                    refreshing={refreshing}
                    type={type}
                />
            )}
            ItemSeparatorComponent={() => {
                if (type === "list") {
                    return (
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
                    );
                }
                return null;
            }}
            onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                        void refetch();
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
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
                <View
                    style={{
                        flexDirection: "row",
                        paddingHorizontal: type === "grid" ? 0 : 16,
                        width: "100%",
                        paddingBottom: 16,
                        gap: 8,
                        justifyContent: "space-between",
                    }}
                >
                    <View style={{ flexDirection: "row", gap: 8 }}>
                        <Pressable
                            style={[
                                styles.sortBtn,
                                sort === "desc" && styles.sortBtnActive,
                            ]}
                            onPress={() => setSort("desc")}
                        >
                            <SortFromBottomToTopIcon
                                size={16}
                                color={sort === "desc" ? "#8065ef" : "#777"}
                            />
                            <TextDefault style={styles.sortText}>
                                Recentes
                            </TextDefault>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.sortBtn,
                                sort === "asc" && styles.sortBtnActive,
                            ]}
                            onPress={() => setSort("asc")}
                        >
                            <SortFromTopToBottomIcon
                                size={16}
                                color={sort === "asc" ? "#8065ef" : "#777"}
                            />
                            <TextDefault style={styles.sortText}>
                                Antigas
                            </TextDefault>
                        </Pressable>
                    </View>
                    <Pressable
                        style={[
                            styles.sortBtn,
                            type === "grid" && styles.sortBtnActive,
                        ]}
                        onPress={() =>
                            setType(type === "grid" ? "list" : "grid")
                        }
                    >
                        <WidgetIcon
                            size={16}
                            color={sort === "asc" ? "#8065ef" : "#777"}
                        />
                    </Pressable>
                </View>
            )}
            ListFooterComponent={
                isFetchingNextPage ? (
                    <ActivityIndicator
                        size="small"
                        color="#00a8ff"
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
                        Fim!
                    </TextDefault>
                )
            }
            ListEmptyComponent={
                isLoading ? (
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
    container: { flex: 1, width: "100%" },
    sortBtn: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 32,
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
