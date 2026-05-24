
import PostEditor from "@/components/reviews/create/rich-text";
import { apiAuth, apiAuthPost } from "@/lib/api";
import { DraftStorage, useReviewSession } from "@/store/reviewSessionStore";
import { CheckCircle  } from "@solar-icons/react-native/Bold";
import { AltArrowLeft } from "@solar-icons/react-native/Outline";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Album, Palette } from "@/lib/types";
import TextDefault from "@/components/core/text-core";

export default function WriteReviewPage({
    album,
    colors,
}: {
    album: Album;
    colors: Palette;
}) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const reviewText = useReviewSession((s) => s.reviewText);
    const setReviewText = useReviewSession((s) => s.setReviewText);
    const overallRating = useReviewSession((s) => s.overallRating);
    const getRatingsArray = useReviewSession((s) => s.getRatingsArray);
    const clearSession = useReviewSession((s) => s.clearSession);
    const albumId = useReviewSession((s) => s.albumId);

    const [ready, setReady] = useState(false);
    const [saveState, setSaveState] = useState<"saved" | "saving">("saved");
    const latestTextRef = useRef("");

    useEffect(() => {
        const init = async () => {
            // se o store já tem esse álbum, usa direto
            if (albumId === album.id) {
                setReady(true);
                return;
            }

            // tenta carregar do draft local
            const draft = DraftStorage.load(album.id);
            if (draft) {
                setReady(true);
                return;
            }

            // nenhum dos dois — busca do servidor
            try {
                const response = await apiAuth(`/me/reviewed/${album.id}`);
                // console.log("Review fetch response:", response);
                if (response.reviewed && response.rating?.review) {
                    setReviewText(response.rating.review);
                }
            } catch (e) {
                console.error("Erro ao buscar review existente:", e);
            } finally {
                setReady(true);
            }
        };

        init();
    }, [album.id]);

    const text =
        albumId === album.id
            ? reviewText
            : (DraftStorage.load(album.id)?.reviewText ?? reviewText);
    const total =
        albumId === album.id
            ? overallRating
            : (DraftStorage.load(album.id)?.overallRating ?? overallRating);
    const ratings =
        albumId === album.id
            ? getRatingsArray()
            : Object.values(DraftStorage.load(album.id)?.ratings ?? {});

    useEffect(() => {
        latestTextRef.current = text;
    }, [text]);

    const handleDraftChange = useCallback((value: string) => {
        latestTextRef.current = value;
        setSaveState("saving");
    }, []);

    const handleAutoSave = useCallback(
        (value: string) => {
            latestTextRef.current = value;
            setReviewText(value);
            setSaveState("saved");
        },
        [setReviewText],
    );

    const handleSubmit = async () => {
        const currentText = latestTextRef.current;

        const response = await apiAuthPost(`/reviews/upsert`, {
            albumId: album.id,
            ratings,
            review: currentText,
            markdown: currentText,
            total,
            published: true,
        });

        if (!response.saved) {
            Alert.alert(
                "Erro",
                "Não foi possível salvar sua avaliação. Tente novamente.",
            );
            return;
        }

        clearSession(album.id);
        router.dismissAll();
        router.replace("/(app)/(tabs)/(home)");
        requestAnimationFrame(() => {
            router.push({
                pathname: `/(app)/(tabs)/(home)/review/[id]`,
                params: { id: response.data.id },
            });
        });
    };

    if (!ready) {
        return (
            <View style={styles.overlay}>
                <ActivityIndicator size="large" color="#8065ef" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <AltArrowLeft size={32} color="#eee" />
                </Pressable>
                <View
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        height: 38,
                        zIndex: -1,
                    }}
                >
                    <View style={[styles.saveStatus, { backgroundColor: saveState === "saving" ? "rgba(255,255,255,0.05)" : "rgba(28, 165, 23,0.1)" }]}>
                        {saveState === "saving" ? (
                            <ActivityIndicator size={14} color="#aaa" />
                        ) : (
                            <CheckCircle  size={14} color="#4ade80" />
                        )}
                        <TextDefault style={styles.saveStatusText}>
                            {saveState === "saving" ? "Salvando" : "Salvo"}
                        </TextDefault>
                    </View>
                </View>
                <Pressable onPress={handleSubmit} style={styles.btn}>
                    <TextDefault style={styles.btnText}>Publicar</TextDefault>
                </Pressable>
            </View>

            <PostEditor
                onDraftChange={handleDraftChange}
                onAutoSave={handleAutoSave}
                initialValue={text}
                total={total}
                album={album}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "transparent",
        flexDirection: "column",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    saveStatus: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    saveStatusText: {
        color: "#bbb",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.2,
    },
    btn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: "#8065ef",
        borderRadius: 999,
    },
    btnText: {
        color: "#eee",
        fontSize: 16,
        fontWeight: "700",
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#161718",
    },
});
