// import { Host, Slider } from "@expo/ui/jetpack-compose";
import Slider from "@react-native-community/slider";
import React, { useRef, useState, useEffect, use } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
    Button,
    Pressable,
    Text,
    TextInput,
} from "react-native";
import { Album, Track, Review, Rating } from "@/lib/types";

export function TrackRating({
    trackData,
    reviewData,
    setRatings,
    initialValue,
}: {
    trackData: Track;
    reviewData:
        | {
              id: number;
              value: number;
              favorite: boolean;
          }
        | Rating
        | null;
    setRatings: React.Dispatch<
        React.SetStateAction<
            {
                id: string;
                value: number;
                favorite: boolean;
                comment: string;
                skip: boolean;
            }[]
        >
    >;
    initialValue?: number;
}) {
    const [value, setValue] = useState(
        reviewData ? reviewData.value : initialValue || 0,
    );
    const handleChange = (num: number) => {
        const numericValue = Number(num.toFixed(2));
        if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
            setValue(numericValue);
            setRatings((prevRatings) =>
                prevRatings.map((rating) =>
                    rating.id === trackData.id
                        ? { ...rating, value: numericValue }
                        : rating,
                ),
            );
        }
    };

    useEffect(() => {
        setValue(reviewData ? reviewData.value : initialValue || 0);
    }, [trackData, reviewData, initialValue]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            // style={styles.container}
        >
            <View style={styles.editorContainer}>
                <Text
                    style={{ color: "#eee", fontSize: 18, fontWeight: "bold" }}
                >
                    {trackData.name}
                </Text>
                <Text style={{ color: "#777", fontSize: 14, marginBottom:0 }}>
                    {trackData.artists.map((artist) => artist.name).join(", ")}
                </Text>

                <View style={styles.textSec}>
                    <Text style={styles.textDefault}>Nota:</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="0"
                            keyboardType="numeric"
                            value={value === 0 ? "" : value.toString()}
                            onChangeText={(num) => handleChange(Number(num))}
                        />
                        <Text style={styles.inputSide}>/100</Text>
                    </View>
                </View>
                <Slider
                    value={value}
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    minimumTrackTintColor="#1DB954"
                    maximumTrackTintColor="#777"
                    thumbTintColor="#1DB954"
                    onValueChange={handleChange}
                    style={{ width: "100%", height: 40 }}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

export default function TrackRater({
    reviewData,
    setRatings,
    
}: {
    reviewData: {
        reviewed: boolean;
        rating: Review | null;
        album: Album;
    };
    setRatings: React.Dispatch<
        React.SetStateAction<
            {
                id: string;
                value: number;
                favorite: boolean;
                comment: string;
                skip: boolean;
            }[]
        >
    >;
}) {
    const [currentTrack, setCurrentTrack] = useState(0);
    const [trackData, setTrackData] = useState<Track | null>(null);
    const [trackRating, setTrackRating] = useState(
        reviewData.rating
            ? reviewData.rating.ratings.find(
                  (r) => r.id === reviewData.album.tracks.items[0].id,
              ) || null
            : null,
    );

    function handleChangeTrack(index: number) {
        setCurrentTrack(index);
        setTrackData(reviewData.album.tracks.items[index]);
        setTrackRating(
            reviewData.rating
                ? reviewData.rating.ratings.find(
                      (r) => r.id === reviewData.album.tracks.items[index].id,
                  ) || null
                : null,
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textDefault}>Avalie as músicas</Text>

            <TrackRating
                trackData={
                    trackData || reviewData.album.tracks.items[currentTrack]
                }
                reviewData={trackRating}
                setRatings={setRatings}
                initialValue={0}
            />

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <Pressable
                    onPress={() => {
                        setCurrentTrack((prev) =>
                            prev > 0
                                ? prev - 1
                                : reviewData.album.tracks.items.length - 1,
                        );
                    }}
                    style={{
                        padding: 8,
                        backgroundColor: "#333",
                        borderRadius: 8,
                        // marginBottom: 8,
                    }}
                >
                    <Text style={{ color: "#eee" }}>Anterior</Text>
                </Pressable>
                <Text style={{ color: "#777", fontSize: 14, alignSelf: "center" }}>
                    {currentTrack + 1}/{reviewData.album.tracks.items.length}
                </Text>
                <Pressable
                    onPress={() => {
                        setCurrentTrack((prev) =>
                            prev < reviewData.album.tracks.items.length - 1
                                ? prev + 1
                                : 0,
                        );
                    }}
                    style={{
                        padding: 8,
                        backgroundColor: "#333",
                        borderRadius: 8,
                        // marginBottom: 16,
                    }}
                >
                    <Text style={{ color: "#eee" }}>Próxima</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        width: "100%",
        backgroundColor: "#222", // Cor de fundo do editor
        borderRadius: 12,
        padding: 16,
    },
    editorContainer: {
        width: "100%",
        paddingVertical: 16,
    },
    textSec: {
        paddingVertical: 16,
        width: "100%",
        color: "#eee",
        borderRadius: 8,
    },
    
    textDefault: {
        color: "#eee",
        fontSize: 16,
        fontWeight: "800",
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
        // gap: 8,
    },
    input: {
        fontSize: 24,
        color: "#eeeeee",
    },
    inputSide: {
        fontSize: 24,
        color: "#eeeeee",
    },
});
