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
    ScrollView,
    FlatList,
} from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import axios from "axios";

import { LinearGradient } from "expo-linear-gradient";
import {
    SkipNext,
    SkipPrevious,
    MusicNote,
} from "@solar-icons/react-native/Bold";

export default function Lyrics({
    reviewData,
    colors,
    currentTrack,
}: {
    reviewData: {
        reviewed: boolean;
        rating: Review | null;
        album: Album;
    };
    colors: Palette | any;
    currentTrack: number;
}) {
    // const [currentTrack, setCurrentTrack] = useState(0);
    const [trackData, setTrackData] = useState<Track | null>(null);

    const [lines, setLines] = useState<any[]>([]);

    useEffect(() => {
        setTrackData(reviewData.album.tracks.items[currentTrack]);
        // console.log("Track data updated:", reviewData.album.tracks.items[currentTrack]);

        const fetchLyrics = async () => {
            try {
                // const response = await axios.get(
                //     `https://api.lyrics.ovh/v1/${reviewData.album.artists[0].name}/${reviewData.album.tracks.items[currentTrack].name}`
                // );

                const response = await axios.get(
                    `https://lyrics.kaizin.work/?trackid=${reviewData.album.tracks.items[currentTrack].id}`,
                );
                // console.log("Lyrics response:", response.data);
                setLines(response.data.lines || []);
            } catch (error) {
                console.error("Error fetching lyrics:", error);
            }
        };
        fetchLyrics();
    }, [currentTrack, reviewData]);

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: darkenColor(selectRightColor(colors), 0.5) },
            ]}
        >
            <Text style={styles.textDefault}>
                Letras de{" "}
                {trackData?.name ||
                    reviewData.album.tracks.items[currentTrack].name}
            </Text>
            <LinearGradient
                // Background Linear Gradient
                colors={[darkenColor(selectRightColor(colors), 0.8), "transparent"]}
                style={styles.background}
            />
            <View
                style={{
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    position: "absolute",
                    flex: 1,
                    borderRadius: 12,
                    overflow: "hidden",
                }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    scrollEnabled={true}
                    contentContainerStyle={{
                        paddingBottom: 40,
                        paddingTop: 16,
                    }}
                    style={styles.lyriscWrapper}
                >
                    {lines.length > 0 ? (
                        lines.map((line, index) => (
                            <Text key={index} style={styles.textSec}>
                                {line.words}
                            </Text>
                        ))
                    ) : (
                        <Text style={styles.textSec}>
                            Letras não encontradas para esta faixa.
                        </Text>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: 500,
        backgroundColor: "#1b1c1d", // Cor de fundo do editor
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        position: "relative",
    },
    lyriscWrapper: {
        width: "100%",
        paddingVertical: 80,
        paddingHorizontal: 16,
        flex: 1,
    },
    textSec: {
        paddingVertical: 8,
        width: "100%",
        color: "#eee",
        borderRadius: 8,
        fontFamily: "Walsheim",
        fontWeight: "700",
        fontSize: 16,
    },

    background: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: 64,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        zIndex: 5,
    },
    textDefault: {
        color: "#eee",
        fontSize: 16,
        fontWeight: "800",
        fontFamily: "Walsheim",
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
