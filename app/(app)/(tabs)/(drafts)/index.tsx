import { DraftStorage, ReviewDraft } from "@/store/reviewSessionStore";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextDefault from "@/components/core/text-core";
import { useRouter } from "expo-router";
import DraftCard from "@/components/drafts/draft-card";

export default function Drafts() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [drafts, setDrafts] = useState<ReviewDraft[]>([]);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setDrafts(DraftStorage.listAll());
        setRefreshing(false);
    };

    useEffect(() => {
        setDrafts(DraftStorage.listAll());
    }, []);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={[styles.main, { paddingTop: insets.top + 16 }]}>
                <TextDefault style={styles.title}>Rascunhos</TextDefault>

                {drafts.length === 0 ? (
                    <TextDefault style={styles.empty}>
                        Nenhum rascunho salvo.
                    </TextDefault>
                ) : (
                    <ScrollView
                        style={{ width: "100%" }}
                        contentContainerStyle={{ padding: 16, gap: 12 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#8065ef"
                                colors={["#8065ef"]}
                            />
                        }
                    >
                        {drafts.map((draft) => (
                            <DraftCard key={draft.albumId} draft={draft} />
                        ))}
                        <View style={{ height: 38 }} />
                    </ScrollView>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#161718",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
    },
    title: {
        color: "#eee",
        fontSize: 22,
        fontWeight: "800",
        alignSelf: "flex-start",
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    empty: {
        color: "#555",
        fontSize: 15,
        marginTop: 40,
    },
    card: {
        backgroundColor: "#1b1c1d",
        borderRadius: 12,
        padding: 16,
        gap: 4,
    },
    cardId: {
        color: "#eee",
        fontSize: 14,
        fontWeight: "bold",
    },
    cardMeta: {
        color: "#777",
        fontSize: 13,
    },
});
