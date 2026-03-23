import { Text, View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import api, { apiAuth } from "@/lib/api";
import { useEffect, useState } from "react";
import { ArtistResponse, Palette } from "@/lib/types";
import ArtistScreen from "@/components/artists/main";
import { getColors } from "react-native-image-colors";

export default function ArtistPage() {
    const { id } = useLocalSearchParams();
    console.log("id from params:", id);

    const [artistData, setArtistData] = useState<ArtistResponse | null>(null);
    const [colors, setColors] = useState<Palette | any>(null);

    useEffect(() => {
        const fetchArtistData = async () => {
            setArtistData(null);
            try {
                const response = await apiAuth(`/artists/${id}`);
                // console.log("Artist data fetched successfully:", response);
                setArtistData(response);

                if (response.images && response.images.length > 0) {
                    const imageUrl = response.images[0].url;
                    const colors = await getColors(imageUrl, {
                        fallback: "#1e1e1e",
                        cache: true,
                        key: imageUrl,
                    });
                    setColors(colors);
                    // console.log("Colors fetched for album image:", colors);
                }
            } catch (error) {
                console.error("Error fetching artist data:", error);
            }
        };
        fetchArtistData();
    }, [id]);

    return (
        <View style={styles.container}>
            {artistData && colors ? (
                <ArtistScreen data={artistData} colors={colors} />
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
