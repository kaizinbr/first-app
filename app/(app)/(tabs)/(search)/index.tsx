import {
    View,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

import { useState, useEffect, useCallback } from "react";
import { Tabs, MaterialTabBar } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchInput from "@/components/search/search-input";
import {
    ResultAlbumBtn,
    ResultArtistBtn,
    ResultTrackBtn,
    ResultUserBtn,
} from "@/components/search/result-btns";
import {
    SearchResponse,
} from "@/lib/types";
import TextDefault from "@/components/core/text-core";
import FeedCard from "@/components/home/feed-card";
import { useLocalSearchParams } from "expo-router";

export default function Index() {
    const insets = useSafeAreaInsets();
    const [results, setResults] = useState<SearchResponse | null>(null);
    const [type, setType] = useState<
        "tracks" | "artists" | "albums" | "users" | "reviews"
    >("albums");
    const [loading, setLoading] = useState(false);

    const { album, artist } = useLocalSearchParams<{ album?: string; artist?: string }>();
    console.log("Search query:", album, artist);

    const renderTabBar = useCallback(
        (props: any) => (
            <MaterialTabBar
                {...props}
                scrollEnabled={true}
                indicatorStyle={{ backgroundColor: "#8065ef", height: 2 }}
                style={{ backgroundColor: "#161718", elevation: 0 }}
                labelStyle={{
                    fontSize: 14,
                    fontWeight: "600",
                    fontFamily: "Walsheim",
                }}
                activeColor="#eee"
                inactiveColor="#777"
                pressColor="transparent"
            />
        ),
        [],
    );

    return (
        <View style={[styles.main]}>
            <SearchInput
                results={results}
                setResults={setResults}
                type={type}
                setLoading={setLoading}
                initialAlbum={album}
                initialArtist={artist}
            />
            <Tabs.Container
                renderTabBar={renderTabBar}
                headerContainerStyle={{ shadowOpacity: 0, elevation: 0 }}
                // style={{ flex: 1, width: "100%" }}
                onTabChange={({ tabName }) => {
                    setType(tabName as any);
                }}
            >
                <Tabs.Tab name="albums" label="Álbuns">
                    <Tabs.FlatList
                        data={results?.albums?.items ?? []}
                        keyExtractor={(item: any) => item.id}
                        renderItem={({ item }) => (
                            <ResultAlbumBtn data={item} />
                        )}
                        ListEmptyComponent={
                            loading ? (
                                <ActivityIndicator
                                    color="#8065ef"
                                    style={{ padding: 20 }}
                                />
                            ) : null
                        }
                        ItemSeparatorComponent={() => (
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: "#3d3d3d",
                                }}
                            />
                        )}
                        ListFooterComponent={
                            <View style={{ height: 80 }} />
                        }
                    />
                </Tabs.Tab>
                <Tabs.Tab name="tracks" label="Músicas">
                    <Tabs.FlatList
                        data={results?.tracks?.items ?? []}
                        keyExtractor={(item: any) => item.id}
                        renderItem={({ item }) => (
                            <ResultTrackBtn data={item} />
                        )}
                        ListEmptyComponent={
                            loading ? (
                                <ActivityIndicator
                                    color="#8065ef"
                                    style={{ padding: 20 }}
                                />
                            ) : null
                        }
                        ItemSeparatorComponent={() => (
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: "#3d3d3d",
                                }}
                            />
                        )}
                    />
                </Tabs.Tab>
                <Tabs.Tab name="artists" label="Artistas">
                    <Tabs.FlatList
                        data={results?.artists?.items ?? []}
                        keyExtractor={(item: any) => item.id}
                        renderItem={({ item }) => (
                            <ResultArtistBtn data={item} />
                        )}
                        ListEmptyComponent={
                            loading ? (
                                <ActivityIndicator
                                    color="#8065ef"
                                    style={{ padding: 20 }}
                                />
                            ) : null
                        }
                        ItemSeparatorComponent={() => (
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: "#3d3d3d",
                                }}
                            />
                        )}
                    />
                </Tabs.Tab>
                <Tabs.Tab name="users" label="Pessoas">
                    <Tabs.FlatList
                        data={results?.users ?? []}
                        keyExtractor={(item: any) => item.id}
                        renderItem={({ item }) => <ResultUserBtn data={item} />}
                        ListEmptyComponent={
                            loading ? (
                                <ActivityIndicator
                                    color="#8065ef"
                                    style={{ padding: 20 }}
                                />
                            ) : null
                        }
                        ItemSeparatorComponent={() => (
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: "#3d3d3d",
                                }}
                            />
                        )}
                    />
                </Tabs.Tab>
                <Tabs.Tab name="reviews" label="Reviews">
                    <Tabs.FlatList
                        data={results?.reviews ?? []}
                        keyExtractor={(item: any) => item.id}
                        renderItem={({ item }) => (
                            <FeedCard review={item} onRefresh={() => {}} />
                        )}
                        ListEmptyComponent={
                            loading ? (
                                <ActivityIndicator
                                    color="#8065ef"
                                    style={{ padding: 20 }}
                                />
                            ) : null
                        }
                        ItemSeparatorComponent={() => (
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: "#3d3d3d",
                                }}
                            />
                        )}
                        ListFooterComponent={
                            <View style={{ height: 80 }} />
                        }
                    />
                </Tabs.Tab>
            </Tabs.Container>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#161718",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
    },
});
