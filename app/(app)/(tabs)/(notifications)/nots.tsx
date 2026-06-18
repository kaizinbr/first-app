import { DraftStorage, ReviewDraft } from "@/store/reviewSessionStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
    FlatList,
    ActivityIndicator,
    Pressable,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextDefault from "@/components/core/text-core";
import { useRouter } from "expo-router";
import NotsCard from "@/components/notifications/nots-card";

import {
    Flag,
    ForbiddenCircle,
    MenuDots,
    Pen,
    TrashBinTrash,
    Eye,
} from "@solar-icons/react-native/Bold";

import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
    BottomSheetScrollView,
    useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import ConfirmModal from "@/components/core/confirm-modal";
import { ShareLargeBtn } from "@/components/core/share-btn";

import { apiAuth, apiAuthPost, apiAuthDELETE } from "@/lib/api";

export default function Drafts() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [drafts, setDrafts] = useState<ReviewDraft[]>([]);

    const [refreshing, setRefreshing] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    const checkNotifications = async () => {
        try {
            const response = await apiAuth("/notifications");
            setNotifications(response.notifications);
            // console.log("Notificações:", response.notifications);
        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
        }
    };

    useEffect(() => {
        checkNotifications();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        checkNotifications();
        setRefreshing(false);
    };

    useEffect(() => {
        const orderedDrafts = DraftStorage.listAll().sort(
            (a, b) => b.savedAt - a.savedAt,
        );
        setDrafts(orderedDrafts);
    }, []);

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["50%", "85%", "100%"], []);

    const openSheet = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

    const { dismiss } = useBottomSheetModal();

    const [isLoading, setIsLoading] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await apiAuthDELETE(`/notifications/all`);
            setIsLoading(false);
            onRefresh();
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    const setAllSeen = async () => {
        try {
            await apiAuthPost(`/notifications/all`);
            onRefresh();
        } catch (error) {
            console.error("Error setting notification as seen:", error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={[styles.main, { paddingTop: insets.top + 16 }]}>
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 16,
                        marginBottom: 8,
                    }}
                >
                    <TextDefault style={styles.title}>Notificações</TextDefault>
                    <Pressable onPress={openSheet}>
                        <MenuDots color="#eee" />
                    </Pressable>
                </View>

                <FlatList
                    style={{ width: "100%" }}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    data={notifications}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <NotsCard nots={item} onRefresh={onRefresh} />
                    )}
                    ListEmptyComponent={
                        <TextDefault style={styles.empty}>
                            Nenhuma notificação.
                        </TextDefault>
                    }
                    ListFooterComponent={<View style={{ height: 38 }} />}
                    ItemSeparatorComponent={() => (
                        <View
                            style={{
                                height: 0.5,
                                backgroundColor: "#3d3d3d",
                            }}
                        />
                    )}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <BottomSheetModal
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                enablePanDownToClose
                topInset={insets.top}
                backgroundStyle={{ backgroundColor: "#161718" }}
                handleIndicatorStyle={{ backgroundColor: "#555" }}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop
                        {...props}
                        disappearsOnIndex={-1}
                        appearsOnIndex={0}
                    />
                )}
            >
                <BottomSheetView>
                    <BottomSheetScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.sheetView}
                    >
                        <Pressable
                            style={({ pressed }) => [
                                styles.optBtn,
                                {
                                    backgroundColor: pressed
                                        ? "rgba(255, 255, 255, 0.05)"
                                        : "transparent",
                                },
                            ]}
                            onPress={() => {
                                dismiss();
                                setAllSeen();
                            }}
                        >
                            <Eye size={24} color="#eee" />
                            <TextDefault style={styles.optText}>
                                Marcar todas como lidas
                            </TextDefault>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.optBtn,
                                {
                                    backgroundColor: pressed
                                        ? "rgba(255, 255, 255, 0.05)"
                                        : "transparent",
                                },
                            ]}
                            onPress={() => {
                                dismiss();
                                setShowDeleteModal(true);
                            }}
                            disabled={notifications.length === 0}
                        >
                            <TrashBinTrash size={24} color="#eee" />
                            <TextDefault style={styles.optText}>
                                Excluir todos
                            </TextDefault>
                        </Pressable>
                    </BottomSheetScrollView>
                </BottomSheetView>
            </BottomSheetModal>
            <ConfirmModal
                visible={showDeleteModal}
                title="Apagar notificações"
                message="Essa ação não pode ser desfeita."
                confirmLabel="Apagar"
                cancelLabel="Cancelar"
                confirmDestructive
                onConfirm={() => {
                    handleDelete();
                    setShowDeleteModal(false);
                }}
                onCancel={() => setShowDeleteModal(false)}
            />
            {isLoading && (
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            zIndex: 999,
                        },
                    ]}
                >
                    <ActivityIndicator size="large" color="#8065ef" />
                </View>
            )}
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
    },
    empty: {
        color: "#555",
        fontSize: 15,
        marginTop: 40,
        height: 40,
        textAlign: "center",
        textAlignVertical: "center",
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

    sheetView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
    },
    optBtn: {
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: "transparent",
        padding: 12,
        width: "100%",
        borderRadius: 8,
    },
    optText: {
        color: "#eee",
        fontSize: 14,
        marginLeft: 12,
    },
    extraInfo: {
        color: "#777",
        fontSize: 14,
    },
});
