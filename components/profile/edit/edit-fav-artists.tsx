import { UserProfile } from "@/lib/types";
import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { AddCircle } from "@/lib/solar-icons/Bold";

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

export default function EditFavArtists({
    artists,
    setArtists,
}: {
    artists: any[];
    setArtists: React.Dispatch<React.SetStateAction<any[]>>;
}) {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [results, setResults] = useState<any>(null);

    function excludeArtist(artistId: string) {
        setArtists((current) => current.filter((artist) => artist.id !== artistId));
    }

    function addArtist(artist: any) {
        setArtists((current) => {
            const alreadyExists = current.some((item) => item.id === artist.id);
            if (alreadyExists) return current;
            return [...current, artist];
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
                    {artists.map((artist: any) => (
                        <View key={artist.id} style={styles.albumItem}>
                            <Image
                                source={{ uri: artist.src }}
                                style={styles.albumImage}
                            />
                            <Pressable
                                style={styles.favCloseBtn}
                                onPress={() => excludeArtist(artist.id)}
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
                            borderRadius: 999,
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
                    type="artists"
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
                    {results?.artists.items.map((artist: any) => (
                        <Pressable
                            key={artist.id}
                            onPress={() =>
                                addArtist({
                                        id: artist.id,
                                        src: artist.images[0]?.url,
                                        name: artist.name,
                                })
                            }
                            style={styles.resultRow}
                        >
                            <Image
                                source={{ uri: artist.images[0]?.url }}
                                style={styles.resultImage}
                            />
                            <View style={{ flex: 1 }}>
                                <TextDefault style={styles.resultTitle}>
                                    {artist.name}
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
    albumRowContent: { gap: 8, paddingVertical: 4, paddingHorizontal: 16 },
    albumItem: { width: ALBUM_ITEM_SIZE, height: ALBUM_ITEM_SIZE },
    albumImage: {
        width: ALBUM_ITEM_SIZE,
        height: ALBUM_ITEM_SIZE,
        borderRadius: 999,
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
    resultImage: { width: 44, height: 44, borderRadius: 999, marginRight: 12 },
    resultTitle: { color: "#eee", fontSize: 14, fontWeight: "bold" },
    resultArtist: { color: "#989898", fontSize: 12 },
});
