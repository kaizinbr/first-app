import {
    View,
    Text,
    Button,
    StyleSheet,
    ScrollView,
    Pressable,
    FlatList,
    useWindowDimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { apiAuth } from "@/lib/api";
import { UserProfile, Review } from "@/lib/types";
import { Tabs } from "react-native-collapsible-tab-view";
import { ArrowRightUp } from "@solar-icons/react-native/Linear";
import { Image } from "expo-image";
import LyricsCard from "@/components/profile/lyrics-card";
import { useRouter } from "expo-router";

import { SimpleGrid } from "react-native-super-grid";

export default function WishlistRoute({ data }: { data: UserProfile }) {
    const GAP = 8;
    const COLUMNS = 4; // quantas colunas quer

    const router = useRouter();

    const { width } = useWindowDimensions();
    const itemSize = (width - 48 - GAP * (COLUMNS + 1)) / COLUMNS;

    const [wishlistAlbums, setWishlistAlbums] = useState<any[]>([]);

    useEffect(() => {
        async function fetchWishlist() {
            try {
                const response = await apiAuth(`/users/${data.username}/wishlist`);
                setWishlistAlbums(response || []);
                console.log("Álbuns na wishlist:", response);
            } catch (error) {
                console.error("Erro ao buscar wishlist:", error);
            }
        }

        fetchWishlist();
    }, [data]);

    return (
        <Tabs.ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                width: "100%",
                padding: 8,
                paddingBottom: 80,
                paddingTop: 448,
            }}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.scene}>
                {wishlistAlbums.length > 0 && (
                    <>
                        <SimpleGrid
                            itemDimension={88}
                            data={wishlistAlbums}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={{
                                        width: "100%",
                                        aspectRatio: 1,
                                        flex: 1,
                                        borderRadius: 8,
                                    }}
                                    onPress={() =>
                                        router.push(`/album/${item.albumId}`)
                                    }
                                >
                                    <Image
                                        source={{ uri: item.coverUrl }}
                                        style={{
                                            width: "100%",
                                            aspectRatio: 1,
                                            flex: 1,
                                            borderRadius: 8,
                                        }}
                                    />
                                </Pressable>
                            )}
                            style={{ padding: 0 }}
                            listKey="albuns-wishlisted"
                        />
                    </>
                )}
            </View>
        </Tabs.ScrollView>
    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,

        gap: 16,
        width: "100%",
    },

    textDefault: {
        color: "#eee", // A cor clara para o seu modo escuro
        fontSize: 16,
    },
    title: {
        color: "#989898",
        fontSize: 14,
        fontWeight: "bold",
    },
    sec: {
        backgroundColor: "#1b1c1d",
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
});
