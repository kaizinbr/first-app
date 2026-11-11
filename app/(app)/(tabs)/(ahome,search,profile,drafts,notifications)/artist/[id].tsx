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

export default function ArtistPage() {
    const { id } = useLocalSearchParams();
    console.log("id from params:", id);

    const [artistData, setArtistData] = useState<ArtistResponse | null>(null);
    const [colors, setColors] = useState<Palette | any>(null);
    const [palette, setPalette] = useState<Palette | any>(null);
    const [mainColor, setMainColor] = useState<string | null>(null);
    const [accentColor, setAccentColor] = useState<string | null>(null);

    useEffect(() => {
        const fetchArtistData = async () => {
            setArtistData(null);
            try {
                const response = await api.get(`/artists/${id}`);
                // console.log("Artist data fetched successfully:", response);
                setArtistData(response.data);

                if (response.data.images && response.data.images.length > 0) {
                    const imageUrl = response.data.images[0].url;
                    const palette = await getPalette(imageUrl, { quality: 10 });
                    setPalette(palette);
                    const main = selectBackgroundColor(palette);
                    setMainColor(main.background);
                    const accent = selectBackgroundGradient(palette);
                    setAccentColor(accent.accent);
                }
            } catch (error) {
                console.error("Error fetching artist data:", error);
            }
        };
        fetchArtistData();
    }, [id]);

    return (
        <View style={styles.container}>
            {artistData && palette && mainColor && accentColor ? (
                <ArtistScreen
                    data={artistData}
                    mainColor={mainColor}
                    accentColor={accentColor}
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
