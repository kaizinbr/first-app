import { UserProfile } from "@/lib/types";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Pressable,
    StyleSheet,
    useWindowDimensions,
    View,
    ActivityIndicator,
} from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import api from "@/lib/api";
import { SimpleGrid } from "react-native-super-grid";
import { useUserWishlist } from "@/lib/queries/user";
import TextDefault from "@/components/core/text-core";

export default function WishlistRoute({ data }: { data: UserProfile }) {
    const GAP = 8;
    const COLUMNS = 4; // quantas colunas quer

    const router = useRouter();

    const { width } = useWindowDimensions();
    const itemSize = (width - 48 - GAP * (COLUMNS + 1)) / COLUMNS;

    const { data: wishlistData, isLoading } = useUserWishlist(data.username);

    return (
        <Tabs.ScrollView
            contentContainerStyle={{
                width: "100%",
                padding: 8,
                paddingBottom: 80,
            }}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.scene}>
                {isLoading && (
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 16,
                        }}
                    >
                        <SimpleGrid
                            itemDimension={88}
                            data={Array.from({ length: 8 }, (_, i) => (i))}
                            renderItem={({ item }) => (
                                <View
                                    style={{
                                        width: "100%",
                                        aspectRatio: 1,
                                        flex: 1,
                                        borderRadius: 8,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: "100%",
                                            aspectRatio: 1,
                                            flex: 1,
                                            borderRadius: 8,
                                            backgroundColor: "#333",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    />
                                </View>
                            )}
                            style={{ padding: 0 }}
                            listKey="albuns-wishlisted"
                        />
                    </View>
                )}
                {wishlistData && wishlistData.length > 0 && (
                    <>
                        <SimpleGrid
                            itemDimension={88}
                            data={wishlistData}
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
                {wishlistData && wishlistData.length === 0 && (
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",   
                            padding: 16,
                        }}
                    >
                        <TextDefault style={styles.textDefault}>
                            Nenhum álbum aqui ainda
                        </TextDefault>
                    </View>
                )}
            </View>
        </Tabs.ScrollView>
    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,

        paddingTop: 8,
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
        backgroundColor: "#212223",
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
});
