import PostEditor from "@/components/reviews/rich-text";
import TrackRating from "@/components/reviews/tracks";
import { Alert } from "react-native";
import { apiAuth, apiAuthPost } from "@/lib/api";
import { Album, Review, Palette } from "@/lib/types";
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
    ActivityIndicator,
} from "react-native";
import { getColors } from "react-native-image-colors";
import type { EnrichedTextInputInstance } from "react-native-enriched";
import ReviewCreateMain from "@/components/reviews/create/main";
import { useRouter } from "expo-router";

export default function ReviewPage() {
    const { id } = useLocalSearchParams();
    console.log("id from params:", id);

    // const editorRef = useRef<EnrichedTextInputInstance>(null);
    const router = useRouter();

    const [reviewData, setReviewData] = useState<{
        reviewed: boolean;
        rating: Review | null;
        album: Album;
    } | null>(null);

    const [total, setTotal] = useState(0);
    const [totalInput, setTotalInput] = useState("");

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
    const [text, setText] = useState("");
    const [useMedia, setUseMedia] = useState(true);
    const [shorten, setShorten] = useState("");

    const [colors, setColors] = useState<Palette | any>(null);

    useEffect(() => {
        if (total > 0 && total != undefined) {
            setTotalInput(Number(total.toFixed(2)).toString());
        }
    }, [total]);

    // Handler só é chamado pelo TextInput — sempre recebe string
    const handleInputChange = (text: string) => {
        const normalized = text.replace(",", ".");

        if (normalized === "" || normalized === ".") {
            setTotalInput(normalized);
            setTotal(0);
            return;
        }

        if (!/^\d+\.?\d{0,2}$/.test(normalized)) return;

        const number = parseFloat(normalized);
        if (isNaN(number)) return;

        const clamped = Math.min(100, Math.max(0, number));
        setTotalInput(normalized);
        setTotal(clamped);
    };

    const handleSubmit = async () => {
        // e.preventDefault();
        console.log(ratings);

        // const reviewHTMLContent = await editorRef.current?.getHTML();

        const response = await apiAuthPost(`/reviews/upsert`, {
            albumId: id,
            ratings,
            review: rawText,
            markdown: text,
            total: total,
            published: true,
        });

        console.log("Response from saving review:", response);

        if (!response.saved) {
            console.error("Error saving ratings", response.data);
            Alert.alert(
                "Erro",
                "Não foi possível salvar sua avaliação. Tente novamente.",
            );
            return;
        } else {
            console.log("Ratings saved/updated", response.data);

            setShorten(response.data.shorten);
            router.replace({
                pathname: `/review/[id]`,
                params: { id: response.data.id },
            });
        }

        // tracks.forEach((track) => {
        //     sessionStorage.removeItem(track.id);
        // });
    };

    useEffect(() => {
        const fetchReviewData = async () => {
            setReviewData(null);
            // console.log("Fetching review data for id:", id, reviewData);
            try {
                const response = await apiAuth(`/me/reviewed/${id}`);
                // console.log("Album data fetched successfully:", response);

                if (response.reviewed && response.rating) {
                    setRatings(response.rating.ratings);
                    setTotal(Number(response.rating.total));
                    // console.log("avaliou")
                } else {
                    setRatings(
                        response.album.tracks.items.map((track: any) => ({
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
                const palette = await getColors(response.album.images[0].url);
                setColors(palette);
            } catch (error) {
                console.error("Error fetching album data:", error);
            }
        };
        fetchReviewData();
    }, [id]);

    // rantings change listener to update total
    useEffect(() => {
        if (!useMedia) return;
        // console.log(ratings);
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
        setTotal(finalRating);
        console.log("Total updated:", finalRating);
    }, [ratings]);

    return (
        <>
            {reviewData && colors ? (
                <ReviewCreateMain
                    reviewData={reviewData}
                    colors={colors}
                    total={total}
                    handleInputChange={handleInputChange}
                    setRatings={setRatings}
                    ratings={ratings}
                    totalInput={totalInput}
                    setTotalInput={setTotalInput}
                    useMedia={useMedia}
                    setUseMedia={setUseMedia}
                    handleSubmit={handleSubmit}
                    text={text}
                    setText={setText}
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
