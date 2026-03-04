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
import {
    SearchResponse,
    Track,
    Album,
    Artist,
    UserProfile,
    Review,
} from "@/lib/types";
import ChipBtn from "@/components/chip-btn";
import {
    ResultUserBtn,
    ResultAlbumBtn,
    ResultArtistBtn,
    ResultTrackBtn,
} from "@/components/search/result-btns";

type Props = {
    results: SearchResponse | null;
    type: "tracks" | "artists" | "albums" | "users" | "reviews";
    setType: (
        type: "tracks" | "artists" | "albums" | "users" | "reviews",
    ) => void;
};

function ItemRenderer({ type, item }: { type: string; item: any }) {
    switch (type) {
        case "albums":
            const album = item as Album;
            return <ResultAlbumBtn data={album} />;
        case "tracks":
            const track = item as Track;
            return <ResultTrackBtn data={track} />;
        case "artists":
            const artist = item as Artist;
            return <ResultArtistBtn data={artist} />;
        case "users":
            const user = item as UserProfile;
            return <ResultUserBtn data={user} />;
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
                style={{ width: "100%", paddingHorizontal: 16, height: "100%" }}
                ItemSeparatorComponent={() => (
                    <View
                        style={{
                            height: 0.5,
                            backgroundColor: "#3d3d3d",
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
                contentContainerStyle={styles.scroll}
                horizontal={true}
            >
                <View style={styles.container}>
                    <ChipBtn
                        label="Albums"
                        onPress={() => {
                            setType("albums");
                            setIndex(2);
                        }}
                        selected={type === "albums"}
                    />
                    <ChipBtn
                        label="Músicas"
                        onPress={() => {
                            setType("tracks");
                            setIndex(0);
                        }}
                        selected={type === "tracks"}
                    />
                    <ChipBtn
                        label="Artistas"
                        onPress={() => {
                            setType("artists");
                            setIndex(1);
                        }}
                        selected={type === "artists"}
                    />
                    <ChipBtn
                        label="Pessoas"
                        onPress={() => {
                            setType("users");
                            setIndex(3);
                        }}
                        selected={type === "users"}
                    />
                    <ChipBtn
                        label="Reviews"
                        onPress={() => {
                            setType("reviews");
                            setIndex(4);
                        }}
                        selected={type === "reviews"}
                    />
                </View>
            </ScrollView>

            {renderScene({ route: routes[index] })}
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        // backgroundColor: "red",
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
    },
    scroll: {
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 10,
        height: 50,
        // width: "100%",
    },

    container: {
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 16,
    },
});
