import { UserProfile } from "@/lib/types";
import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { AddCircle } from "@solar-icons/react-native/Bold";

import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextDefault from "@/components/core/text-core";

import SearchAlbunsInput from "@/components/profile/edit/search-favs-input";
import { Palette } from "@/lib/types";

import Ionicons from "@expo/vector-icons/Ionicons";

const ALBUM_ITEM_SIZE = 72;

export default function EditFavAlbuns({
    albuns,
    setAlbuns,
}: {
    albuns: any[];
    setAlbuns: React.Dispatch<React.SetStateAction<any[]>>;
}) {
    const insets = useSafeAreaInsets();
    const router = useRouter();
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
        <BottomSheetView style={styles.container}>
            {/* Cabeçalho FIXO — não rola */}
            <View>
                <TextDefault style={styles.title}>Álbuns favoritos</TextDefault>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.albumRowContent}
                    style={styles.albumRow}
                >
                    {albuns.map((album: any) => (
                        <View key={album.id} style={styles.albumItem}>
                            <Image
                                source={{ uri: album.src }}
                                style={styles.albumImage}
                            />
                            <Pressable
                                style={styles.favCloseBtn}
                                onPress={() => excludeAlbum(album.id)}
                                hitSlop={8}
                            >
                                <Ionicons
                                    name="close-sharp"
                                    size={16}
                                    color="#eee"
                                />
                            </Pressable>
                        </View>
                    ))}
                    <View
                        style={{
                            width: ALBUM_ITEM_SIZE,
                            height: ALBUM_ITEM_SIZE,
                            borderRadius: 8,
                            backgroundColor: "rgba(128, 101, 239, 0.1)",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <AddCircle size={32} color="#8065ef" />
                    </View>
                </ScrollView>
            </View>
            <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
                <SearchAlbunsInput
                    results={results}
                    setResults={setResults}
                    type="albuns"
                    setLoading={() => {}}
                />
            </View>
            {/* Apenas os RESULTADOS rolam, presos ao espaço restante */}
            <View
                style={{
                    flex: 1,
                    marginTop: 16,
                    // backgroundColor: "red",
                    maxHeight: "45%",
                    paddingHorizontal: 16,
                }}
            >
                <ScrollView
                    style={{
                        flex: 1,
                    }}
                    // keyboardShouldPersistTaps="handled"
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
                            style={styles.resultRow}
                        >
                            <Image
                                source={{ uri: album.images[0]?.url }}
                                style={styles.resultImage}
                            />
                            <View style={{ flex: 1 }}>
                                <TextDefault style={styles.resultTitle}>
                                    {album.name}
                                </TextDefault>
                                <TextDefault style={styles.resultArtist}>
                                    {album.artists
                                        .map((a: any) => a.name)
                                        .join(", ")}
                                </TextDefault>
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        </BottomSheetView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, marginTop: 8 },
    title: {
        color: "#989898",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8,
        paddingHorizontal: 16,
    },
    albumRow: { 
        marginTop: 8, 
        flexGrow: 0,
        width: "100%",
    },
    albumRowContent: { gap: 8, paddingVertical: 4,
        paddingHorizontal: 16, },
    albumItem: { width: ALBUM_ITEM_SIZE, height: ALBUM_ITEM_SIZE },
    albumImage: {
        width: ALBUM_ITEM_SIZE,
        height: ALBUM_ITEM_SIZE,
        borderRadius: 8,
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
    resultRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    resultImage: { width: 44, height: 44, borderRadius: 4, marginRight: 12 },
    resultTitle: { color: "#eee", fontSize: 14, fontWeight: "bold" },
    resultArtist: { color: "#989898", fontSize: 12 },
});
