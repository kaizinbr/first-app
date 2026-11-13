import TextDefault from "@/components/core/text-core";
import api from "@/lib/api";
import { Album, Review } from "@/lib/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import {
    selectBackgroundColor,
    selectBackgroundGradient,
} from "@/lib/util/selectRightColor";
import { getPalette } from "expo-color-thief-native";

import { Palette } from "@/lib/types";

import ReviewAlbumScreen from "@/components/reviews/display/main";

import { useReview } from "@/lib/queries/review";
import usePalette from "@/lib/util/usePalette";

export default function ReviewPage() {
    const { id } = useLocalSearchParams();
    console.log("id from params:", id);

    // const [reviewData, setReviewData] = useState<Review | null>(null);
    const [albumData, setAlbumData] = useState<Album | null>(null);
    const [notfound, setNotFound] = useState(false);

    const [colors, setColors] = useState<Palette | any>(null);
    // const [palette, setPalette] = useState<Palette | any>(null);

    const { data: reviewData, isPending, isError } = useReview(id as string);
    const { data: palette } = usePalette(reviewData?.album.images[0].url);

    const notFound = isError || reviewData === null;

    return (
        <>
            {reviewData && palette ? (
                <ReviewAlbumScreen
                    reviewData={reviewData}
                    mainColor={selectBackgroundColor(palette).background}
                    accentColor={selectBackgroundGradient(palette).accent}
                />
            ) : notFound ? (
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
            ) : isPending ? (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#8065ef" />
                </View>
            ) : null}
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
