import { Rating, Track } from "@/lib/types";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

export default function TrackRating({
    trackData,
    reviewData,
    setRatings,
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
}) {
    const [value, setValue] = useState(reviewData ? reviewData.value : 0);
    const handleChange = (text: string) => {
        const numericValue = Number(text);
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

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.editorContainer}>
                <Text
                    style={{ color: "#eee", fontSize: 18, fontWeight: "bold" }}
                >
                    {trackData.name}
                </Text>
                <Text style={{ color: "#777", fontSize: 14, marginBottom: 8 }}>
                    {trackData.artists.map((artist) => artist.name).join(", ")}
                </Text>
                <Text style={{ color: "#eee", fontSize: 16 }}>
                    {reviewData
                        ? `Sua avaliação: ${reviewData.value} estrelas${
                              reviewData.favorite ? " (Favorita)" : ""
                          }`
                        : "Você ainda não avaliou esta faixa."}
                </Text>

                <View style={styles.textSec}>
                    <Text style={styles.textDefault}>Nota:</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="0"
                            keyboardType="numeric"
                            value={value === 0 ? "" : value.toString()}
                            onChangeText={handleChange}
                        />
                        <Text style={styles.inputSide}>/100</Text>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718",
        justifyContent: "flex-end",
    },
    editorContainer: {
        width: "100%",
        backgroundColor: "#1b1c1d", // Cor de fundo do editor
        borderRadius: 8,
        padding: 12,
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
