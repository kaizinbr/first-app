import ArtistScreen from "@/components/artists/main";
import api from "@/lib/api";
import { ArtistResponse, Palette } from "@/lib/types";
import {
    selectBackgroundColor,
    selectBackgroundGradient,
} from "@/lib/util/selectRightColor";
import { getPalette } from "expo-color-thief-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import usePalette from "@/lib/util/usePalette";
import { useArtist } from "@/lib/queries/artist";

export default function ArtistPage() {
    const { id } = useLocalSearchParams();
    console.log("id from params:", id);
    const { data: artistData, isPending, isError } = useArtist(id as string);
    const [colors, setColors] = useState<Palette | any>(null);

    const { data: palette } = usePalette(artistData?.images[0].url, {
        quality: 10,
    });

    return (
        <View style={styles.container}>
            {artistData && palette ? (
                <ArtistScreen
                    data={artistData}
                    palette={palette}
                />
            ) : (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#8065ef" />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718",
        width: "100%",
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
