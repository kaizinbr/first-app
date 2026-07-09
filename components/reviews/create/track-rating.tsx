// components/reviews/create/track-rating.tsx
import { Album, Palette, Track } from "@/lib/types";
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
import { SkipNext, SkipPrevious, Stars } from "@solar-icons/react-native/Bold";
import { useReviewSession } from "@/store/reviewSessionStore";

function TrackRating({
    track,
    colors,
    showComment,
}: {
    track: Track;
    colors: Palette;
    showComment: boolean;
}) {
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
        <View style={styles.editorContainer}>
            <TextDefault style={styles.trackName}>{track.name}</TextDefault>
            <TextDefault style={styles.trackArtist}>
                {track.artists.map((a) => a.name).join(", ")}
            </TextDefault>

            {!skip && (
                <View style={styles.textSec}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={value === 0 ? "" : value.toString()}
                            onChangeText={handleInputChange}
                            placeholder="0"
                            placeholderTextColor="#555"
                            keyboardType="numeric"
                        />
                        <TextDefault style={styles.inputSide}>/100</TextDefault>
                    </View>
                </View>
            )}

            {(showComment || comment.length > 0) && (
                <View style={styles.textSec}>
                    <TextDefault style={styles.label}>Comentário:</TextDefault>
                    <TextInput
                        style={styles.commentInput}
                        value={comment}
                        onChangeText={(text) => setTrackComment(track.id, text)}
                        placeholder="Escreva um comentário sobre a música..."
                        placeholderTextColor="#555"
                        multiline
                        maxLength={300}
                    />
                    <TextDefault style={styles.charCount}>
                        {comment.length}/300
                    </TextDefault>
                </View>
            )}
        </View>
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
    const favorite = useReviewSession(
        (s) => s.ratings[track.id]?.favorite ?? false,
    );
    const comment = useReviewSession((s) => s.ratings[track.id]?.comment ?? "");

    const setTrackSkip = useReviewSession((s) => s.setTrackSkip);
    const setTrackFavorite = useReviewSession((s) => s.setTrackFavorite);

    const [showComment, setShowComment] = useState(false);

    useEffect(() => {
        setShowComment(false);
        setShowLyrics(false);
    }, [currentTrack]);

    return (
        <View style={styles.container}>
            <TextDefault style={styles.sectionLabel}>
                Avalie as músicas
            </TextDefault>

            <TrackRating
                track={track}
                colors={colors}
                showComment={showComment}
            />

            <View style={styles.actionsRow}>
                <Pressable
                    style={[
                        styles.toggleBtn,
                        favorite && styles.toggleBtnActive,
                    ]}
                    onPress={() => setTrackFavorite(track.id, !favorite)}
                >
                    <Stars size={12} color="#eee" />
                    <TextDefault
                        style={[
                            styles.toggleText,
                            favorite && styles.toggleTextActive,
                        ]}
                    >
                        Favorita
                    </TextDefault>
                </Pressable>

                <Pressable
                    style={[
                        styles.toggleBtn,
                        (showComment || comment.length > 0) &&
                            styles.toggleBtnActive,
                    ]}
                    onPress={() => setShowComment(!showComment)}
                >
                    <TextDefault
                        style={[
                            styles.toggleText,
                            (showComment || comment.length > 0) &&
                                styles.toggleTextActive,
                        ]}
                    >
                        Comentário
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
                        Pular
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
                    <SkipPrevious size={24} color={"#8065ef"} />
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
                    <SkipNext size={24} color={"#8065ef"} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#212223",
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
    textSec: { paddingTop: 8, width: "100%" },
    label: {
        color: "#eee",
        fontSize: 16,
        fontWeight: "600",
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
    actionsRow: {
        flexDirection: "row",
        gap: 8,
        marginTop: 4,
        flexWrap: "wrap",
    },
    toggleBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 32,
        backgroundColor: "#282828",
        alignItems: "center",
        flexDirection: "row",
        gap: 4,
    },
    toggleBtnActive: { backgroundColor: "#8065ef" },
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
