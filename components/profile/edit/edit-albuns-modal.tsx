// components/core/confirm-modal.tsx
import {
    Modal,
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
    FlatList,
    Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { AddCircle } from "@solar-icons/react-native/Bold";
import SearchAlbunsInput from "@/components/profile/edit/search-favs-input";

import Ionicons from "@expo/vector-icons/Ionicons";

interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmDestructive?: boolean; // deixa o botão de confirmar vermelho
    onConfirm: () => void;
    onCancel: () => void;
}

const ALBUM_GRID_GAP = 12;
const ALBUM_GRID_MIN_ITEM_SIZE = 64;

export default function EditAlbunsModal({
    albuns,
    setAlbuns,
    visible,
    title,
    message,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    confirmDestructive = false,
    onConfirm,
    onCancel,
}: {
    albuns: any[];
    setAlbuns: React.Dispatch<React.SetStateAction<any[]>>;
    visible: boolean;
    title: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmDestructive?: boolean; // deixa o botão de confirmar vermelho
    onConfirm: () => void;
    onCancel: () => void;
}) {
    const [results, setResults] = useState<any>(null);

    function excludeAlbum(albumId: string) {
        setAlbuns((current) => current.filter((album) => album.id !== albumId));
    }

    function addAlbum(album: any) {
        setAlbuns((current) => {
            const alreadyExists = current.some((item) => item.id === album.id);
            if (alreadyExists) return current;
            return [...current, album];
        });
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onCancel}
        >
            {/* Overlay escuro — toque fora fecha */}
            <View style={styles.overlay}>
                {/* Para o toque no card não fechar */}
                <View style={styles.card}>
                    <Text style={styles.title}>Álbuns favoritos</Text>

                    <FlatList
                        data={albuns}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ maxHeight: 80, zIndex: 10 }}
                        contentContainerStyle={{ paddingTop: 16, gap: 12 }}
                        renderItem={({ item: album }) => (
                            <View
                                style={{
                                    width: 64,
                                    height: 80,
                                    position: "relative",
                                }}
                            >
                                <Image
                                    source={{ uri: album.src }}
                                    style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 4,
                                        marginRight: 12,
                                    }}
                                />
                                <Pressable
                                    style={styles.favCloseBtn}
                                    onPress={() => excludeAlbum(album.id)}
                                >
                                    <Ionicons
                                        name="close-sharp"
                                        size={16}
                                        color="black"
                                    />
                                </Pressable>
                            </View>
                        )}
                        ListFooterComponent={
                            <View
                                style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: 4,
                                    backgroundColor: "rgba(128, 101, 239, 0.1)",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <AddCircle size={32} color="#8065ef" />
                            </View>
                        }
                    />
                    <View
                        style={{
                            marginTop: 16,
                            width: "100%",
                            flex: 1,
                        }}
                    >
                        <SearchAlbunsInput
                            results={results}
                            setResults={setResults}
                            type="albuns"
                            setLoading={() => {}}
                        />
                        <ScrollView
                            style={{ marginTop: 16, maxHeight: "100%" }}
                        >
                            {results?.albums.items.map((album: any) => (
                                <Pressable
                                    key={album.id}
                                    onPress={() =>
                                        addAlbum({
                                            id: album.id,
                                            src: album.images[0]?.url,
                                            title: album.name,
                                            artist: album.artists[0]?.name,
                                        })
                                    }
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginBottom: 16,
                                    }}
                                >
                                    <Image
                                        source={{ uri: album.images[0]?.url }}
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 4,
                                            marginRight: 12,
                                        }}
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                color: "#eee",
                                                fontSize: 14,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {album.name}
                                        </Text>
                                        <Text
                                            style={{
                                                color: "#989898",
                                                fontSize: 12,
                                            }}
                                        >
                                            {album.artists
                                                .map(
                                                    (artist: any) =>
                                                        artist.name,
                                                )
                                                .join(", ")}
                                        </Text>
                                    </View>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                    <Pressable style={[styles.btn]} onPress={onCancel}>
                        <Text style={styles.btnText}>Pronto</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    card: {
        width: "100%",
        height: "80%",
        backgroundColor: "#222",
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        gap: 12,
        zIndex: 5,
    },
    title: {
        color: "#eee",
        fontSize: 18,
        fontWeight: "bold",
    },
    message: {
        color: "#aaa",
        fontSize: 14,
        lineHeight: 20,
    },
    actions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },
    btn: {
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#8065ef",
    },
    cancelBtn: {
        backgroundColor: "#333",
    },
    btnText: {
        color: "#eee",
        fontWeight: "700",
    },
    confirmBtn: {
        backgroundColor: "#8065ef",
    },
    confirmText: {
        color: "#fff",
        fontWeight: "600",
    },
    destructiveBtn: {
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        borderWidth: 1,
        borderColor: "#ef4444",
    },
    destructiveText: {
        color: "#ef4444",
    },

    favBtn: {
        position: "relative",
        bottom: 8,
    },
    favCloseBtn: {
        position: "absolute",
        top: -4,
        right: -4,
        backgroundColor: "#8065ef",
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
    },
});
