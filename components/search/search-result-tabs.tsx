import React, { useState } from "react";
import {
    View,
    Text,
    useWindowDimensions,
    FlatList,
    StyleSheet,
    ScrollView,
    Pressable,
} from "react-native";
import { SearchResponse, Track, Album, Artist, User, Review } from "@/lib/types";
import ChipBtn from "@/components/chip-btn";
import { ResultUserBtn, ResultAlbumBtn, ResultArtistBtn, ResultTrackBtn } from "@/components/search/result-btns";

type Props = {
    results: SearchResponse | null;
    type: "tracks" | "artists" | "albums" | "users" | "reviews";
    setType: (
        type: "tracks" | "artists" | "albums" | "users" | "reviews",
    ) => void;
};

function ItemRenderer({ type, item }: { type: string; item: any }) {
    switch (type) {
        case "tracks":
            const track = item as Track;
            return <ResultTrackBtn name={track.name} id={track.album.id} artists={track.artists.map((a) => a.name)} />;
        case "artists":
            const artist = item as Artist;
            return (
                <ResultArtistBtn name={artist.name} id={artist.id} />
            );
        case "albums":
            const album = item as Album;
            return (
                <ResultAlbumBtn name={album.name} id={album.id} artists={album.artists.map((a) => a.name)} />
            );
        case "users":
            const user = item as User;
            return (
                <ResultUserBtn name={user.name} username={user.username} />
            );
        case "reviews":
            const review = item as Review; // 
            return (
                <View style={{ padding: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>
                        {review.Profile.username} - {review.total}
                    </Text>
                    <Text>{review.shorten}</Text>
                </View>
            );
        default:
            return null;
    }
}

export default function SearchTabs({ results, setType, type }: Props) {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);

    // Normalizando os dados da API para listas simples
    const tabsData = [
        { key: "tracks", title: "Songs", data: results?.tracks?.items ?? [] },
        {
            key: "artists",
            title: "Artists",
            data: results?.artists?.items ?? [],
        },
        { key: "albums", title: "Albums", data: results?.albums?.items ?? [] },
        { key: "users", title: "Users", data: results?.users ?? [] },
        { key: "reviews", title: "Reviews", data: results?.reviews ?? [] },
    ];

    // console.log("Tabs data:", tabsData);

    const routes = tabsData.map((t) => ({
        key: t.key,
        title: t.title,
    }));

    const renderScene = ({ route }: any) => {
        const tab = tabsData.find((t) => t.key === route.key);

        if (!tab) return null;

        return (
            <FlatList
                data={tab.data as any}
                keyExtractor={(item: any) => item.id}
                showsVerticalScrollIndicator={false}
                style={{ width: layout.width, paddingHorizontal: 16, height: "100%" }}
                ItemSeparatorComponent={() => (
                    <View
                        style={{
                            height: 1,
                            backgroundColor: "#E0E0E0",
                            // marginVertical: 10,
                        }}
                    />
                )}
                renderItem={({ item }) => (
                    <ItemRenderer type={route.key} item={item} />
                )}
            />
        );
    };

    return (
        <View style={styles.main}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsContainer}
                horizontal={true}
            >
                <ChipBtn
                    label="Tracks"
                    onPress={() => {
                        setType("tracks");
                        setIndex(0);
                    }}
                />
                <ChipBtn
                    label="Artists"
                    onPress={() => {
                        setType("artists");
                        setIndex(1);
                    }}
                />
                <ChipBtn
                    label="Albums"
                    onPress={() => {
                        setType("albums");
                        setIndex(2);
                    }}
                />
                <ChipBtn
                    label="Users"
                    onPress={() => {
                        setType("users");
                        setIndex(3);
                    }}
                />
                <ChipBtn
                    label="Reviews"
                    onPress={() => {
                        setType("reviews");
                        setIndex(4);
                    }}
                />
            </ScrollView>

            {renderScene({ route: routes[index] })}

        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        // backgroundColor: "red",
        padding: 16,
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
    },
    chipsContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: 16,
        gap: 10,
        height: 50,
        // width: "100%",
    },
});
