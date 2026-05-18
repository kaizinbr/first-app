// app/create/review/[id]/write.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AltArrowLeft } from "@solar-icons/react-native/Outline";
import { apiAuthPost } from "@/lib/api";
import { useReviewSession, DraftStorage } from "@/store/reviewSessionStore";
import PostEditor from "@/components/reviews/rich-text";
import { apiAuth } from "@/lib/api";

import { Album, Track, Review, Palette } from "@/lib/types";

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
                console.log("Review fetch response:", response);
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

    const handleSubmit = async () => {
        const response = await apiAuthPost(`/reviews/upsert`, {
            albumId: album.id,
            ratings,
            review: text,
            markdown: text,
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
                <Pressable onPress={handleSubmit} style={styles.btn}>
                    <Text style={styles.btnText}>Publicar</Text>
                </Pressable>
            </View>

            <PostEditor
                onChange={setReviewText}
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
        backgroundColor: "#161718",
        flexDirection: "column",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 8,
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
        fontWeight: "800",
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#161718",
    },
});
