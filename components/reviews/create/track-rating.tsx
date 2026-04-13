// import { Host, Slider } from "@expo/ui/jetpack-compose";
import { Album, Palette, Rating, Review, Track } from "@/lib/types";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { darkenColor } from "@/lib/util/workWithColors";
import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Slider } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";

import {
    SkipNext,
    SkipPrevious,
    MusicNote,
} from "@solar-icons/react-native/Bold";

export function TrackRating({
    trackData,
    reviewData,
    setRatings,
    initialValue,
    colors,
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
    colors: Palette | any;
}) {
    const [value, setValue] = useState(
        reviewData ? reviewData.value : initialValue || 0,
    );

    // progress sincronizado com o estado
    const progress = useSharedValue(
        reviewData ? reviewData.value : initialValue || 0,
    );
    const min = useSharedValue(0);
    const max = useSharedValue(100);

    const handleSliderChange = (num: number) => {
        const numericValue = Math.round(num); // slider pode dar decimais mesmo com step=1
        progress.value = numericValue;
        setValue(numericValue);
        setRatings((prevRatings) =>
            prevRatings.map((rating) =>
                rating.id === trackData.id
                    ? { ...rating, value: numericValue }
                    : rating,
            ),
        );
    };

    // Handler específico do input — recebe string
    const handleInputChange = (text: string) => {
        if (text === "" || text === ".") {
            setValue(0);
            progress.value = 0;
            return;
        }
        const numericValue = parseFloat(text);
        if (isNaN(numericValue)) return;
        const clamped = Math.min(100, Math.max(0, numericValue));
        setValue(clamped);
        progress.value = clamped;
        setRatings((prevRatings) =>
            prevRatings.map((rating) =>
                rating.id === trackData.id
                    ? { ...rating, value: clamped }
                    : rating,
            ),
        );
    };

    useEffect(() => {
        const newValue = reviewData ? reviewData.value : initialValue || 0;
        setValue(newValue);
        progress.value = newValue; // atualiza o slider ao trocar de música
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
                <Text style={{ color: "#777", fontSize: 14, marginBottom: 0 }}>
                    {trackData.artists.map((artist) => artist.name).join(", ")}
                </Text>

                <View style={styles.textSec}>
                    <Text style={styles.textDefault}>Nota:</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={value === 0 ? "" : value.toString()}
                            onChangeText={handleInputChange}
                            placeholder="0"
                            keyboardType="numeric"
                        />
                        <Text style={styles.inputSide}>/100</Text>
                    </View>
                </View>
                <Slider
                    progress={progress}
                    minimumValue={min}
                    maximumValue={max}
                    // step={1}
                    // minimumTrackTintColor="#1DB954"
                    // maximumTrackTintColor="#777"
                    // thumbTintColor="#1DB954"
                    onValueChange={handleSliderChange}
                    style={{ width: "100%", marginBottom: 16 }}
                    theme={{
                        minimumTrackTintColor: darkenColor(
                            selectRightColor(colors),
                            0.1,
                        ),
                        maximumTrackTintColor: "#333",
                        bubbleBackgroundColor: darkenColor(
                            selectRightColor(colors),
                            0.5,
                        ),
                    }}
                    containerStyle={{
                        height: 12, // grossura da trilha
                        borderRadius: 6,
                    }}
                    thumbWidth={18}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

export default function TrackRater({
    reviewData,
    setRatings,
    ratings,
    colors,
    setCurrentTrack,
    currentTrack,
    showLyrics,
    setShowLyrics,
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
    colors: Palette | any;
    ratings: any;
    setCurrentTrack: React.Dispatch<React.SetStateAction<number>>;
    currentTrack: number;
    showLyrics: boolean;
    setShowLyrics: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    // const [currentTrack, setCurrentTrack] = useState(0);
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
                initialValue={
                    ratings.find(
                        (r: any) =>
                            r.id ===
                            reviewData.album.tracks.items[currentTrack].id,
                    )?.value
                }
                colors={colors}
            />
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <Pressable
                    style={[
                        styles.toggleBtn,
                        showLyrics && styles.toggleBtnActive,
                    ]}
                    onPress={() => setShowLyrics((prev) => !prev)}
                >
                    <Text
                        style={[
                            styles.toggleText,
                            showLyrics && styles.toggleTextActive,
                        ]}
                    >
                        Letras
                    </Text>
                </Pressable>
            </View>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                        marginTop: 16,
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
                    <SkipPrevious
                        size={24}
                        color={darkenColor(selectRightColor(colors), 0.1)}
                    />
                </Pressable>
                <Text
                    style={{ color: "#777", fontSize: 14, alignSelf: "center" }}
                >
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
                    <SkipNext
                        size={24}
                        color={darkenColor(selectRightColor(colors), 0.1)}
                    />
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
        backgroundColor: "#1b1c1d", // Cor de fundo do editor
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
    toggleBtn: {
        // flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 32,
        backgroundColor: "#282828",
        alignItems: "center",
    },
    toggleBtnActive: {
        backgroundColor: "#404245",
    },
    toggleText: {
        color: "#eee",
        fontSize: 12,
    },
    toggleTextActive: {
        color: "#fff",
    },
});
