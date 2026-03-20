import api, { apiAuth } from "@/lib/api";
import { Album, Review } from "@/lib/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";

import { getColors } from "react-native-image-colors";

import { Palette } from "@/lib/types";

import AlbumScreen from "@/components/reviews/display/main";

export default function ReviewPage() {
    const { shorten } = useLocalSearchParams();
    console.log("shorten from params:", shorten);

    const [reviewData, setReviewData] = useState<Review | null>(null);
    const [albumData, setAlbumData] = useState<Album | null>(null);

    const [colors, setColors] = useState<Palette | any>(null);

    useEffect(() => {
        const fetchReviewData = async () => {
            setReviewData(null);
            // console.log("Fetching album data for id:", id, albumData);
            try {
                const reviewDataRes = await apiAuth(`/reviews/${shorten}`);
                console.log(
                    "Album data fetched successfully:",
                    reviewDataRes[0].album_id,
                );
                setReviewData(reviewDataRes[0]);

                const albumDataRes = await api(
                    `/albuns/${reviewDataRes[0].album_id}`,
                );
                setAlbumData(albumDataRes.data);

                if (
                    albumDataRes.data.images &&
                    albumDataRes.data.images.length > 0
                ) {
                    const imageUrl = albumDataRes.data.images[0].url;
                    const colors = await getColors(imageUrl, {
                        fallback: "#000",
                        cache: true,
                        key: imageUrl,
                    });
                    setColors(colors);
                    // console.log("Colors fetched for album image:", colors);
                }
            } catch (error) {
                console.error("Error fetching review data:", error);
            }
        };
        fetchReviewData();
    }, [shorten]);

    return (
        <>
            {reviewData && albumData ? (
                <AlbumScreen
                    reviewData={reviewData}
                    albumData={albumData}
                    colors={colors}
                />
            ) : (
                <View style={styles.container}>
                    <Text style={styles.title}>Carregando...</Text>
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
        marginBottom: 200,
        marginTop: 300,
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
});
