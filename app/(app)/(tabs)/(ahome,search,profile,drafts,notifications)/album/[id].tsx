import api from "@/lib/api";
import { Album } from "@/lib/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { getPalette } from "expo-color-thief-native";

import { Palette } from "@/lib/types";

import AlbumScreen from "@/components/albuns/main";
import usePalette from "@/lib/util/usePalette";
import { useAlbum } from "@/lib/queries/album";

export default function AlbumPage() {
    const { id } = useLocalSearchParams();
    console.log("id from params:", id);

    const [userData, setUserData] = useState<any>(null);

    const [colors, setColors] = useState<Palette | any>(null);

    const { data: albumData, isPending, isError } = useAlbum(id as string);
    const { data: palette } = usePalette(albumData?.images[0].url, { quality: 10 });

    return (
        <>
            {albumData && palette ? (
                <AlbumScreen
                    albumData={albumData}
                    userData={userData}
                    palette={palette}
                />
            ) : (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#8065ef" />
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: "#161718",
        color: "#eeeeee",
        alignItems: "center",
        width: "100%",
        marginBottom: 100,
    },
    main: {
        flex: 1,
        backgroundColor: "#161718",
        color: "#eeeeee",
        paddingTop: 16,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        padding: 16,
        width: "100%",
        color: "#eee",
        borderRadius: 8,
    },
    textDefault: {
        color: "#eee", // A cor clara para o seu modo escuro
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        color: "#eee",
    },
    image: {
        width: 300,
        height: 300,
        marginTop: 20,
        resizeMode: "contain",
    },
    overlay: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        backgroundColor: "#161718",
        zIndex: 10,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});
