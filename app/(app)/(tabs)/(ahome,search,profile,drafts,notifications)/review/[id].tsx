import api, { apiAuth } from "@/lib/api";
import { Album, Review } from "@/lib/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import TextDefault from "@/components/core/text-core";

import { getPalette, getColor } from "expo-color-thief-native";
import { selectBackgroundColor, selectBackgroundGradient } from "@/lib/util/selectRightColor";

import { Palette } from "@/lib/types";

import ReviewAlbumScreen from "@/components/reviews/display/main";

export default function ReviewPage() {
    const { id } = useLocalSearchParams();
    console.log("id from params:", id);

    const [reviewData, setReviewData] = useState<Review | null>(null);
    const [albumData, setAlbumData] = useState<Album | null>(null);
    const [notfound, setNotFound] = useState(false);

    const [colors, setColors] = useState<Palette | any>(null);
    const [palette, setPalette] = useState<Palette | any>(null);

    useEffect(() => {
        const fetchReviewData = async () => {
            setReviewData(null);
            // console.log("Fetching album data for id:", id, albumData);
            const reviewDataRes = await apiAuth(`/reviews/${id}`);
            try {
                if (!reviewDataRes || reviewDataRes.length === 0) {
                    console.error("No review data found for id:", id);
                    setNotFound(true);
                    return;
                }

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
                    const palette = await getPalette(imageUrl, { quality: 10 });
                    setPalette(palette);
                }
            } catch (error) {
                console.error("Error fetching review data:", error);
                setNotFound(true);
                console.log("Error details:", {
                    reviewDataRes,
                });
            }
        };
        fetchReviewData();
    }, [id]);

    return (
        <>
            {reviewData && albumData ? (
                <ReviewAlbumScreen
                    reviewData={reviewData}
                    albumData={albumData}
                    mainColor={selectBackgroundColor(palette).background}
                    accentColor={selectBackgroundGradient(palette).accent}
                />
            ) : notfound ? (
                <View style={styles.container}>
                    <View style={{ alignItems: "center", gap: 16 }}>
                        <TextDefault style={styles.title}>
                            Review não encontrada
                        </TextDefault>
                        <TextDefault style={styles.textDefault}>
                            Parece que essa review não está mais disponível...
                            Que tal explorar outras reviews ou voltar para a
                            página inicial?
                        </TextDefault>
                    </View>
                </View>
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
        justifyContent: "center",
        padding: 24,
        width: "100%",
        height: "100%",
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
        textAlign: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        color: "#eee",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
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
