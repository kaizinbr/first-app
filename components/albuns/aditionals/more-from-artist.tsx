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
} from "react-native";
import TextDefault from "@/components/core/text-core";
import { Album } from "@/lib/types";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { useArtistAlbunsRelative } from "@/lib/queries/artist";

export default function MoreFromArtist({ data }: { data: Album }) {
    const router = useRouter();

    const { data: artistAlbuns, isPending } = useArtistAlbunsRelative(data.artists[0].id, 0, 6);
    // console.log("artistAlbuns:", artistAlbuns);


    return (
        <View style={[styles.container]}>
            <Pressable onPress={() => router.push(`/artist/${data.artists[0].id}`)}>
                <TextDefault style={styles.title}>
                    Mais de {data.artists[0].name}
                </TextDefault>
            </Pressable>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
            >
                {artistAlbuns?.items
                    .filter((album: Album) => album.id !== data.id)
                    .map((album: Album) => (
                        <Pressable
                            key={album.id}
                            onPress={() => router.push(`/album/${album.id}`)}
                        >
                            <Image
                                source={{ uri: album.images[0].url }}
                                style={styles.albumCover}
                            />
                            <TextDefault
                                style={styles.albumTitle}
                                numberOfLines={1}
                            >
                                {album.name}
                            </TextDefault>
                            {/* <TextDefault
                                style={styles.albumArtist}
                                numberOfLines={1}
                            >
                                {album.artists.map((artist) => artist.name).join(", ")}
                            </TextDefault> */}
                        </Pressable>
                    ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        flex: 1,
        backgroundColor: "transparent",
        zIndex: 10,
    },
    title: {
        color: "fff",
        // fontSize: 12,
        fontWeight: "500",
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    albumCover: {
        width: 124,
        height: 124,
        borderRadius: 8,
    },
    albumTitle: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
        marginTop: 8,
        width: 124,
    },
    albumArtist: {
        color: "#dbdbdb",
        fontSize: 12,
        fontWeight: "500",
        marginTop: 4,
        width: 124,
    },
    spotifyButton: {
        backgroundColor: "#A2BCF7",
        borderWidth: 1,
        borderColor: "#A2BCF7",
        padding: 8,
        borderRadius: 999,
        marginTop: 16,
        width: 164,
        alignItems: "center",
    },
    spotifyText: {
        color: "#161718",
        fontSize: 14,
        fontWeight: "500",
    },
    moreData: {
        marginTop: 24,
        padding: 16,
        backgroundColor: "#1e1e1e",
    },
    extraInfo: {
        color: "#777",
        fontSize: 14,
    },
});
