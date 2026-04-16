import {
    Modal,
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
    Image,
    ActivityIndicator,
} from "react-native";
import { useCallback, useState, useEffect } from "react";
import SearchAlbunsInput from "@/components/profile/edit/search-favs-input";
import axios from "axios";
import { AltArrowLeft } from "@solar-icons/react-native/Outline";
import { getColors } from "react-native-image-colors";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { darkenColor } from "@/lib/util/workWithColors";
import { LinearGradient } from "expo-linear-gradient";

export interface SavedLyrics {
    trackId: string;
    trackName: string;
    artistNames: string;
    albumArt: string;
    lines: { startTimeMs: string; words: string }[];
    selectedIndexes: number[];
    color: string;
}

const MAX_LINES = 4;

export default function LyricsModal({
    visible,
    savedLyrics,
    onConfirm,
    onCancel,
}: {
    visible: boolean;
    savedLyrics?: SavedLyrics | null;
    onConfirm: (saved: SavedLyrics) => void;
    onCancel: () => void;
}) {
    const [step, setStep] = useState(0);
    const [track, setTrack] = useState<any>(null);
    const [results, setResults] = useState<any>(null);
    const [lines, setLines] = useState<{ startTimeMs: string; words: string }[]>([]);
    const [color, setColor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set());

    // Ao abrir o modal: restaura estado salvo ou começa do zero
    useEffect(() => {
        if (!visible) return;

        if (savedLyrics) {
            setTrack({
                id: savedLyrics.trackId,
                name: savedLyrics.trackName,
                artists: savedLyrics.artistNames.split(", ").map((name) => ({ name })),
                album: { images: [{ url: savedLyrics.albumArt }] },
            });
            setLines(savedLyrics.lines);
            setColor(savedLyrics.color);
            setSelectedLines(new Set(savedLyrics.selectedIndexes));
            setStep(1);
        } else {
            setTrack(null);
            setLines([]);
            setColor(null);
            setSelectedLines(new Set());
            setResults(null);
            setStep(0);
        }
    }, [visible]);

    // Busca letras e cor ao selecionar um track novo (não vindo de savedLyrics)
    useEffect(() => {
        if (!track || savedLyrics?.trackId === track.id) return;

        setLoading(true);
        setSelectedLines(new Set());

        const fetchColors = async () => {
            try {
                const resultColors = await getColors(track.album.images[0]?.url, {
                    fallback: "#000",
                    cache: true,
                    key: track.album.images[0]?.url,
                });
                setColor(darkenColor(selectRightColor(resultColors as any), 1.3));
            } catch (error) {
                console.error("Error fetching colors:", error);
            }
        };

        const fetchLyrics = async () => {
            try {
                const response = await axios.get(
                    `https://lyrics.kaizin.work/?trackid=${track.id}`,
                );
                setLines(response.data.lines || []);
            } catch (error) {
                console.error("Error fetching lyrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLyrics();
        fetchColors();
    }, [track]);

    const toggleLine = useCallback((index: number) => {
        setSelectedLines((prev) => {
            const selected = Array.from(prev).sort((a, b) => a - b);

            if (selected.length === 0) return new Set([index]);

            const min = selected[0];
            const max = selected[selected.length - 1];
            const isSelected = prev.has(index);
            const isAdjacent = index === min - 1 || index === max + 1;

            if (isSelected && (index === min || index === max)) {
                const next = new Set(prev);
                next.delete(index);
                return next;
            }

            if (isSelected) return prev;

            if (isAdjacent && selected.length < MAX_LINES) {
                return new Set([...prev, index]);
            }

            return new Set([index]);
        });
    }, []);

    const getLineState = useCallback(
        (index: number) => {
            if (selectedLines.has(index)) return "selected";
            const selected = Array.from(selectedLines).sort((a, b) => a - b);
            if (selected.length === 0) return "idle";
            const min = selected[0];
            const max = selected[selected.length - 1];
            if (
                (index === min - 1 || index === max + 1) &&
                selected.length < MAX_LINES
            ) {
                return "adjacent";
            }
            return "blocked";
        },
        [selectedLines],
    );

    const handleConfirm = useCallback(() => {
        if (!track || !color) return;
        onConfirm({
            trackId: track.id,
            trackName: track.name,
            artistNames: track.artists.map((a: any) => a.name).join(", "),
            albumArt: track.album.images[0]?.url,
            lines: lines.map((l) => ({ startTimeMs: l.startTimeMs, words: l.words })),
            selectedIndexes: Array.from(selectedLines).sort((a, b) => a - b),
            color,
        });
        onCancel();
    }, [track, lines, selectedLines, color]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onCancel}
        >
            <Pressable style={styles.overlay} onPress={onCancel}>
                <View style={styles.card} onStartShouldSetResponder={() => true}>
                    {step === 0 && (
                        <View style={{ flex: 1, padding: 24 }}>
                            <Text style={styles.title}>Letras</Text>
                            <SearchAlbunsInput
                                results={results}
                                setResults={setResults}
                                type="tracks"
                                setLoading={() => {}}
                            />
                            <ScrollView style={{ marginTop: 16 }}>
                                {results?.tracks.items.map((item: any) => (
                                    <Pressable
                                        key={item.id}
                                        onPress={() => {
                                            setTrack(item);
                                            setStep(1);
                                        }}
                                        style={styles.trackRow}
                                    >
                                        <Image
                                            source={{ uri: item.album.images[0]?.url }}
                                            style={styles.trackThumb}
                                        />
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.trackName}>
                                                {item.name}
                                            </Text>
                                            <Text style={styles.trackArtist}>
                                                {item.artists
                                                    .map((a: any) => a.name)
                                                    .join(", ")}
                                            </Text>
                                        </View>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {step === 1 && (
                        <View style={styles.stepContainer}>
                            {loading || !color ? (
                                <ActivityIndicator size="large" color="#8065ef" />
                            ) : (
                                <View style={[styles.container, { backgroundColor: color }]}>
                                    <Pressable
                                        onPress={() => {
                                            setTrack(null);
                                            setColor(null);
                                            setLines([]);
                                            setSelectedLines(new Set());
                                            setStep(0);
                                        }}
                                        style={styles.backButton}
                                    >
                                        <AltArrowLeft size={32} color="#eee" />
                                    </Pressable>

                                    <Text style={[styles.textDefault, { zIndex: 10 }]}>
                                        Letras de {track?.name}
                                    </Text>

                                    <LinearGradient
                                        colors={[color, "transparent"]}
                                        style={[styles.gradient, { top: 0 }]}
                                    />

                                    <View style={styles.scrollContainer}>
                                        <ScrollView
                                            showsVerticalScrollIndicator={false}
                                            nestedScrollEnabled
                                            contentContainerStyle={{
                                                paddingBottom: 160,
                                                paddingTop: 16,
                                            }}
                                            style={styles.lyricsWrapper}
                                        >
                                            {lines.length > 0 ? (
                                                lines.map((line, index) => {
                                                    const state = getLineState(index);
                                                    return (
                                                        <Pressable
                                                            key={index}
                                                            onPress={() => toggleLine(index)}
                                                            style={[
                                                                styles.line,
                                                                state === "selected" && styles.lineSelected,
                                                                state === "adjacent" && styles.lineAdjacent,
                                                                state === "blocked" && styles.lineBlocked,
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.lineText,
                                                                    state === "selected" && styles.lineTextSelected,
                                                                ]}
                                                            >
                                                                {line.words}
                                                            </Text>
                                                        </Pressable>
                                                    );
                                                })
                                            ) : (
                                                <Text style={styles.textSec}>
                                                    Letras não encontradas para esta faixa.
                                                </Text>
                                            )}
                                        </ScrollView>
                                    </View>

                                    <LinearGradient
                                        colors={["transparent", color]}
                                        style={[styles.gradient, { bottom: 44 }]}
                                    />
                                    <View
                                        style={[
                                            styles.gradientFooter,
                                            { backgroundColor: color },
                                        ]}
                                    />

                                    <Pressable
                                        style={[
                                            styles.btn,
                                            selectedLines.size === 0 && styles.btnDisabled,
                                        ]}
                                        onPress={handleConfirm}
                                        disabled={selectedLines.size === 0}
                                    >
                                        <Text style={styles.btnText}>
                                            {selectedLines.size > 0
                                                ? `Confirmar ${selectedLines.size} linha${selectedLines.size > 1 ? "s" : ""}`
                                                : "Selecione linhas"}
                                        </Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    card: {
        width: "100%",
        height: "80%",
        backgroundColor: "#222",
        borderRadius: 16,
        zIndex: 5,
    },
    title: {
        color: "#eee",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    trackRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    trackThumb: {
        width: 44,
        height: 44,
        borderRadius: 4,
        marginRight: 12,
    },
    trackName: {
        color: "#eee",
        fontSize: 14,
        fontWeight: "bold",
    },
    trackArtist: {
        color: "#989898",
        fontSize: 12,
    },
    stepContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flex: 1,
        width: "100%",
        borderRadius: 16,
        padding: 16,
        position: "relative",
        overflow: "hidden",
    },
    scrollContainer: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 16,
        overflow: "hidden",
    },
    lyricsWrapper: {
        paddingHorizontal: 16,
        paddingVertical: 80,
    },
    backButton: {
        position: "absolute",
        left: 12,
        top: 4,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
    },
    textDefault: {
        color: "#eee",
        fontSize: 16,
        fontWeight: "800",
        fontFamily: "Walsheim",
        textAlign: "center",
    },
    textSec: {
        color: "#eee",
        fontFamily: "Walsheim",
        fontWeight: "700",
        fontSize: 16,
        paddingVertical: 8,
    },
    gradient: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 64,
        zIndex: 5,
    },
    gradientFooter: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 44,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        zIndex: 5,
    },
    btn: {
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#8065ef",
        position: "absolute",
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 10,
    },
    btnDisabled: {
        backgroundColor: "#444",
    },
    btnText: {
        color: "#eee",
        fontWeight: "700",
    },
    line: {
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.2)",
        marginVertical: 4,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    lineSelected: {
        backgroundColor: "#eee",
    },
    lineAdjacent: {
        backgroundColor: "rgba(255,255,255,0.13)",
    },
    lineBlocked: {
        backgroundColor: "rgba(255,255,255,0.08)",
        opacity: 0.4,
    },
    lineText: {
        color: "#eee",
        fontFamily: "Walsheim",
        fontWeight: "700",
        fontSize: 16,
    },
    lineTextSelected: {
        color: "#222",
    },
});