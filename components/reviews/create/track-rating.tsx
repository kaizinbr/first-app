// components/reviews/create/track-rating.tsx
import { Album, Palette, Track } from "@/lib/types";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { darkenColor } from "@/lib/util/workWithColors";
import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import TextDefault from "@/components/core/text-core";
import { SkipNext, SkipPrevious } from "@solar-icons/react-native/Bold";
import { useReviewSession } from "@/store/reviewSessionStore";

function TrackRating({ track, colors }: { track: Track; colors: Palette }) {
    const entry = useReviewSession((s) => s.ratings[track.id]);
    const setTrackRating = useReviewSession((s) => s.setTrackRating);
    const setTrackSkip = useReviewSession((s) => s.setTrackSkip);
    const setTrackComment = useReviewSession((s) => s.setTrackComment);

    const value = entry?.value ?? 0;
    const skip = entry?.skip ?? false;
    const comment = entry?.comment ?? "";

    const handleInputChange = (text: string) => {
        if (text === "" || text === ".") {
            setTrackRating(track.id, 0);
            return;
        }
        const num = parseFloat(text);
        if (isNaN(num)) return;
        setTrackRating(track.id, Math.min(100, Math.max(0, num)));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.editorContainer}>
                <TextDefault style={styles.trackName}>{track.name}</TextDefault>
                <TextDefault style={styles.trackArtist}>
                    {track.artists.map((a) => a.name).join(", ")}
                </TextDefault>

                {!skip && (
                    <View style={styles.textSec}>
                        <TextDefault style={styles.label}>Nota:</TextDefault>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={value === 0 ? "" : value.toString()}
                                onChangeText={handleInputChange}
                                placeholder="0"
                                placeholderTextColor="#555"
                                keyboardType="numeric"
                            />
                            <TextDefault style={styles.inputSide}>
                                /100
                            </TextDefault>
                        </View>
                    </View>
                )}

                <TextInput
                    style={styles.commentInput}
                    value={comment}
                    onChangeText={(text) => setTrackComment(track.id, text)}
                    placeholder="Comentário sobre a faixa..."
                    placeholderTextColor="#555"
                    maxLength={300}
                    multiline
                />
                <TextDefault style={styles.charCount}>
                    {comment.length}/300
                </TextDefault>
            </View>
        </KeyboardAvoidingView>
    );
}

export default function TrackRater({
    album,
    colors,
    currentTrack,
    setCurrentTrack,
    showLyrics,
    setShowLyrics,
}: {
    album: Album;
    colors: Palette;
    currentTrack: number;
    setCurrentTrack: React.Dispatch<React.SetStateAction<number>>;
    showLyrics: boolean;
    setShowLyrics: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const track = album.tracks.items[currentTrack];
    const total = album.tracks.items.length;

    const skip = useReviewSession((s) => s.ratings[track.id]?.skip ?? false);
    const setTrackSkip = useReviewSession((s) => s.setTrackSkip);

    return (
        <View style={styles.container}>
            <TextDefault style={styles.sectionLabel}>
                Avalie as músicas
            </TextDefault>

            <TrackRating track={track} colors={colors} />

            <View style={styles.actionsRow}>
                <Pressable
                    style={[styles.toggleBtn, skip && styles.toggleBtnActive]}
                    onPress={() => setTrackSkip(track.id, !skip)}
                >
                    <TextDefault
                        style={[
                            styles.toggleText,
                            skip && styles.toggleTextActive,
                        ]}
                    >
                        Pular música
                    </TextDefault>
                </Pressable>

                <Pressable
                    style={[
                        styles.toggleBtn,
                        showLyrics && styles.toggleBtnActive,
                    ]}
                    onPress={() => setShowLyrics((prev) => !prev)}
                >
                    <TextDefault
                        style={[
                            styles.toggleText,
                            showLyrics && styles.toggleTextActive,
                        ]}
                    >
                        Letras
                    </TextDefault>
                </Pressable>
            </View>

            <View style={styles.navRow}>
                <Pressable
                    onPress={() =>
                        setCurrentTrack((prev) =>
                            prev > 0 ? prev - 1 : total - 1,
                        )
                    }
                    style={styles.navBtn}
                >
                    <SkipPrevious
                        size={24}
                        color={"#8065ef"}
                    />
                </Pressable>

                <TextDefault style={styles.trackCount}>
                    {currentTrack + 1}/{total}
                </TextDefault>

                <Pressable
                    onPress={() =>
                        setCurrentTrack((prev) =>
                            prev < total - 1 ? prev + 1 : 0,
                        )
                    }
                    style={styles.navBtn}
                >
                    <SkipNext
                        size={24}
                        color={"#8065ef"}
                    />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#1b1c1d",
        borderRadius: 12,
        padding: 16,
    },
    editorContainer: { width: "100%", paddingVertical: 8 },
    sectionLabel: {
        color: "#eee",
        fontSize: 16,
        fontWeight: "800",
        fontFamily: "Walsheim",
        marginBottom: 4,
    },
    trackName: { color: "#eee", fontSize: 18, fontWeight: "bold" },
    trackArtist: { color: "#777", fontSize: 14, marginBottom: 0 },
    textSec: { paddingTop: 16, width: "100%" },
    label: {
        color: "#eee",
        fontSize: 16,
        fontWeight: "800",
        fontFamily: "Walsheim",
    },
    inputWrapper: { flexDirection: "row", alignItems: "center" },
    input: { fontSize: 24, color: "#eeeeee", fontFamily: "Walsheim" },
    inputSide: { fontSize: 24, color: "#eeeeee" },
    commentInput: {
        marginTop: 12,
        color: "#eee",
        fontSize: 14,
        backgroundColor: "#252627",
        borderRadius: 8,
        padding: 12,
        minHeight: 72,
        textAlignVertical: "top",
    },
    charCount: {
        color: "#555",
        fontSize: 12,
        marginTop: 4,
        textAlign: "right",
    },
    actionsRow: { flexDirection: "row", gap: 8, marginTop: 4 },
    toggleBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 32,
        backgroundColor: "#282828",
        alignItems: "center",
    },
    toggleBtnActive: { backgroundColor: "#404245" },
    toggleText: { color: "#eee", fontSize: 12 },
    toggleTextActive: { color: "#fff" },
    navRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 16,
    },
    navBtn: { padding: 8, backgroundColor: "#333", borderRadius: 8 },
    trackCount: { color: "#777", fontSize: 14, alignSelf: "center" },
});
