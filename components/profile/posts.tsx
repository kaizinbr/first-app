import {
    View,
    Text,
    Image,
    Button,
    StyleSheet,
    ScrollView,
} from "react-native";
import { UserProfile, ReviewWithAlbum } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";
import api, { apiAuth } from "@/lib/api";
import { Tabs } from "react-native-collapsible-tab-view";
import { ActivityIndicator } from "react-native";
import FeedCard from "@/components/home/feed-card";
import { usePaginatedReviews } from "@/lib/util/usePaginatedReviews";

export default function PostsRoute({ data }: { data: UserProfile }) {
    const { reviews, loadingInitial, loadingMore, hasMore, loadMoreForTabs } =
        usePaginatedReviews({ endpoint: `/users/${data.username}/reviews` });

    const ItemSeparator = () => {
        return <View style={styles.separator} />;
    };

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

    return (
        <Tabs.FlatList
            data={reviews}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <FeedCard review={item} />}
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
            showsVerticalScrollIndicator={false}
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
                        Fim!
                    </Text>
                ) : null
            }
            ListEmptyComponent={
                loadingInitial ? (
                    <ActivityIndicator
                        size="large"
                        color="#00a8ff"
                        style={{ marginTop: 40 }}
                    />
                ) : (
                    <Text
                        style={{
                            color: "#eee",
                            textAlign: "center",
                            marginTop: 40,
                        }}
                    >
                        Nenhuma avaliação ainda.
                    </Text>
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
});
