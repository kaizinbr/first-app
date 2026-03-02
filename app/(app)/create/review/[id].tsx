import PostEditor from "@/components/reviews/rich-text";
import TrackRating from "@/components/reviews/tracks";
import { apiAuth, apiAuthPost } from "@/lib/api";
import { Album, Review } from "@/lib/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Pressable,
} from "react-native";

import type { EnrichedTextInputInstance } from "react-native-enriched";

export default function ReviewPage() {
    const { id } = useLocalSearchParams();
    console.log("id from params:", id);

    const editorRef = useRef<EnrichedTextInputInstance>(null);

    const [reviewData, setReviewData] = useState<{
        reviewed: boolean;
        rating: Review | null;
        albumData: Album;
    } | null>(null);

    const [total, setTotal] = useState(0);
    const [ratings, setRatings] = useState<
        {
            id: string;
            value: number;
            favorite: boolean;
            comment: string;
            skip: boolean;
        }[]
    >([]);
    const [rawText, setRawText] = useState("");
    const [jsonContent, setJsonContent] = useState({});
    const [useMedia, setUseMedia] = useState(true);

    useEffect(() => {
        const fetchReviewData = async () => {
            setReviewData(null);
            // console.log("Fetching review data for id:", id, reviewData);
            try {
                const response = await apiAuth(`/me/reviewed/${id}`);
                // console.log("Album data fetched successfully:", response);
                if (response.reviewed && response.rating) {
                    setRatings(response.rating.ratings);
                    setTotal(response.rating.total);
                    // console.log("avaliou")
                } else {
                    setRatings(
                        response.albumData.tracks.items.map((track: any) => ({
                            id: track.id,
                            value: 0,
                            favorite: false,
                            comment: "",
                            skip: false,
                        })),
                    );
                    setTotal(0);
                    // console.log("não avaliou", ratings)
                }

                // console.log("Ratings state initialized:", ratings);
                setReviewData(response);
            } catch (error) {
                console.error("Error fetching album data:", error);
            }
        };
        fetchReviewData();
    }, [id]);

    const handleTotalChange = (e: any) => {
        if (e.target.value === "") {
            setTotal(0);
            return;
        } else if (isNaN(Number(e.target.value))) {
            return;
        }

        if (Number(e.target.value) > 100) {
            setTotal(100);
            return;
        } else if (Number(e.target.value) < 0) {
            setTotal(0);
            return;
        }
        setTotal(Number(e.target.value));
    };

    const handleSubmit = async () => {
        // e.preventDefault();
        console.log(ratings);

        const cumulativeRating = ratings.reduce(
            (acc, rating) => acc + rating.value,
            0,
        );

        let finalRating;
        if (useMedia) {
            finalRating = cumulativeRating / ratings.length;
        } else {
            finalRating = total;
        }

        const reviewHTMLContent = await editorRef.current?.getHTML();

        const response = await apiAuthPost(`/reviews/upsert`, {
            albumId: id,
            ratings,
            review: rawText,
            html: reviewHTMLContent,
            total: total,
            published: true,
        });

        console.log("Response from saving review:", response);

        if (!response.saved) {
            console.error("Error saving ratings", response.data);
            return;
        } else {
            console.log("Ratings saved/updated", response.data);
            // setShorten(response.data.data.shorten);
            // router.push(`/r/${response.data.data.shorten}`);
        }

        // tracks.forEach((track) => {
        //     sessionStorage.removeItem(track.id);
        // });
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            {reviewData ? (
                <View style={styles.main}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {reviewData.albumData.name}
                        </Text>
                        <Text style={styles.textDefault}>
                            {reviewData.albumData.artists
                                .map((artist) => artist.name)
                                .join(", ")}
                        </Text>
                        <Image
                            source={{ uri: reviewData.albumData.images[0].url }}
                            style={styles.image}
                        />
                    </View>
                    <View style={styles.textSec}>
                        <Text style={styles.textDefault}>
                            {reviewData.reviewed ? "Reviewed" : "Not reviewed"}
                        </Text>
                    </View>
                    <View style={styles.textSec}>
                        <Text style={styles.textDefault}>Nota:</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={total === 0 ? "" : total.toString()}
                                
                                onChangeText={(text) => handleTotalChange({ target: { value: text } })}
                            />
                            <Text style={styles.inputSide}>/100</Text>
                        </View>
                    </View>
                    <View style={styles.textSec}>
                        <PostEditor ref={editorRef} />
                    </View>
                    <View style={styles.tracks}>
                        <Text style={styles.textDefault}>Músicas:</Text>
                        {reviewData.albumData.tracks.items.map((track: any) => (
                            <TrackRating
                                key={track.id}
                                trackData={track}
                                reviewData={
                                    reviewData.rating
                                        ? reviewData.rating.ratings.find(
                                              (r) => r.id === track.id,
                                          ) || null
                                        : null
                                }
                                setRatings={setRatings}
                            />
                        ))}
                    </View>
                    <Pressable
                        onPress={handleSubmit}
                        style={{
                            backgroundColor: "#1f64d4",
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 8,
                            alignSelf: "flex-start",
                            marginBottom: 32,
                        }}
                    >
                        <Text style={{ color: "#eeeeee", fontSize: 16 }}>
                            Salvar Resenha
                        </Text>
                    </Pressable>
                </View>
            ) : (
                <Text style={styles.textDefault}>Loading album data...</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        marginBottom: 56,
    },
    main: {
        flex: 1,
        backgroundColor: "#161718",
        color: "#eeeeee",
        alignItems: "center",
        width: "100%",
        paddingTop: 16,
        justifyContent: "flex-start",
    },
    header: {
        padding: 16,
        width: "100%",
        color: "#eee",
        borderRadius: 8,
    },
    textSec: {
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
        width: 150,
        height: 150,
        marginTop: 20,
        resizeMode: "contain",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        fontSize: 24,
        color: "#eeeeee",
    },
    inputSide: {
        fontSize: 24,
        color: "#eeeeee",
    },
    tracks: {
        width: "100%",
        gap: 12,
        padding: 16,
    },
});
