import TextDefault from "@/components/core/text-core";
import api from "@/lib/api";
import { Album, Palette } from "@/lib/types";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { darkenColor } from "@/lib/util/workWithColors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    StyleSheet,
    View,
    Dimensions,
} from "react-native";
import { getColor } from "@/modules/expo-color-thief-native/src";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useArtistAlbuns } from "@/lib/queries/artist";

function AlbumCard({ album, width }: { album: any; width: number }) {
    const router = useRouter();
    console.log("album data:", width);
    const cardWidth = width / 2 - 24; // Ajuste para o espaçamento entre os cards

    const [color, setColor] = useState<string | null>(null);
    useEffect(() => {
        const fetchColors = async () => {
            try {
                const result = await getColor(album.images[0]?.url, {
                    quality: 5,
                });
                setColor(result!.hex);
            } catch (error) {
                console.error("Error fetching colors:", error);
            }
        };
        fetchColors();
    }, [album.images[0]?.url]);

    return (
        <Pressable
            style={{
                // position: "relative",
                minWidth: cardWidth,
                minHeight: cardWidth,
                flex: 1,
                aspectRatio: 1,
                overflow: "hidden",
                borderRadius: 12,
            }}
            onPress={() => {
                router.push(`/album/${album.id}`);
            }}
        >
            {album.images[0]?.url && color ? (
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
                        <TextDefault style={styles.albumTitle}>
                            {album.name}
                        </TextDefault>
                        <TextDefault style={styles.albumArtist}>
                            {album.artists[0]?.name}
                        </TextDefault>
                    </View>
                    <LinearGradient
                        colors={["transparent", darkenColor(color, 0.3)]}
                        style={{
                            height: "60%",
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
    const width = Dimensions.get("screen").width;

    const { data: albunsData, isPending, isError } = useArtistAlbuns(data.id, 0, 50);

    return (
        <View style={[styles.container, { paddingTop: 16, zIndex: 10 }]}>
            {albunsData?.items?.map((album: Album) => (
                <AlbumCard key={album.id} album={album} width={width} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        // backgroundColor: "red",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
        // justifyContent: "space-between",
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
    albumType: {
        color: "#dbdbdb",
        fontSize: 12,
        fontWeight: "500",
    },
    albumTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginTop: 4,
    },
    albumArtist: {
        color: "#dbdbdb",
        fontSize: 12,
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
