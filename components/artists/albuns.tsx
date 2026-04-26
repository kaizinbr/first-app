import {
    Text,
    Image,
    View,
    StyleSheet,
    ScrollView,
    Platform,
    Pressable,
    StatusBar as RNStatusBar,
    Dimensions,
    FlatList,
    ActivityIndicator,
} from "react-native";
import TextDefault from "@/components/core/text-core";
import Animated, {
    useAnimatedStyle,
    useAnimatedScrollHandler,
    useSharedValue,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Palette } from "@/lib/types";
import { getColors } from "react-native-image-colors";
import { darkenColor } from "@/lib/util/workWithColors";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { LinearGradient } from "expo-linear-gradient";

function AlbumCard({ album }: { album: any }) {
    const router = useRouter();

    const [colors, setColors] = useState<Palette | any>(null);
    useEffect(() => {
        const fetchColors = async () => {
            try {
                const result = await getColors(album.images[0]?.url, {
                    fallback: "#000",
                    quality: "low",
                });
                setColors(result);
            } catch (error) {
                console.error("Error fetching colors:", error);
            }
        };
        fetchColors();
    }, [album.images[0]?.url]);

    return (
        <Pressable
            style={{
                marginBottom: 24,
                position: "relative",
                width: "100%",
                aspectRatio: 1,
                overflow: "hidden",
                borderRadius: 12,
            }}
            onPress={() => {
                router.push(`/album/${album.id}`);
            }}
        >
            {album.images[0]?.url && colors ? (
                <>
                    <Image
                        source={{ uri: album.images[0]?.url }}
                        style={styles.album}
                    />

                    <View
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: 12,
                            zIndex: 10,

                        }}
                    >
                        {/* <TextDefault style={styles.albumType}>{album.album_type}</TextDefault> */}
                        <TextDefault style={styles.albumTitle}>{album.name}</TextDefault>
                        <TextDefault style={styles.albumArtist}>
                            {album.artists[0]?.name}
                        </TextDefault>
                    </View>
                    <LinearGradient
                        colors={[
                            "transparent",
                            darkenColor(selectRightColor(colors), 0.4),
                        ]}
                        style={{
                            height: "50%",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            position: "absolute",
                            zIndex: 5,
                        }}
                    />
                </>
            ) : (
                <View
                    style={[
                        styles.album,
                        {
                            backgroundColor: "#333",
                            justifyContent: "center",
                            alignItems: "center",
                        },
                    ]}
                >
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}
        </Pressable>
    );
}

export default function ArtistAlbuns({ data }: any) {
    const insets = useSafeAreaInsets();

    const [albuns, setAlbuns] = useState<any[]>([]);

    useEffect(() => {
        const fetchAlbuns = async () => {
            try {
                const response = await api(`/artists/${data.id}/albuns`);
                setAlbuns(response.data.items);
            } catch (error) {
                console.error("Error fetching artist albuns:", error);
            }
        };
        fetchAlbuns();
    }, [data.id]);

    function loadMoreAlbuns() {
        // Implementar lógica para carregar mais álbuns, se necessário
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            {albuns.map((album) => (
                <AlbumCard key={album.id} album={album} />
            ))}

            {/* <FlatList
                data={albuns}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable key={item.id} style={{ marginBottom: 24 }} onPress={() => { }}>
                        <Image
                            source={{ uri: item.images[0]?.url }}
                            style={styles.album}
                        />
                    </Pressable>
                )}
                // estimatedItemSize={200}
                onEndReached={loadMoreAlbuns}
                onEndReachedThreshold={0.5}
            /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingHorizontal: 16,
        backgroundColor: "transparent",
    },
    artist: {
        width: "60%",
        height: "auto",
        aspectRatio: 1,
        minHeight: 200,
        minWidth: 200,
        borderRadius: 999,
        marginTop: 100,
        marginBottom: 32,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    albumType: { color: "#c4c4c4", fontSize: 12, fontWeight: "500" },
    albumTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "700",
        marginTop: 4,
    },
    albumArtist: {
        color: "#ccc",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 4,
    },
    album: {
        width: "100%",
        // height: 200,
        aspectRatio: 1,
        borderRadius: 12,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
    },
});
