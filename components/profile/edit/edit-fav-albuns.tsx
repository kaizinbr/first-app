import { UserProfile } from "@/lib/types";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
    Image,
    LayoutChangeEvent,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SearchAlbunsInput from "@/components/profile/edit/search-favs-input";
import { Palette } from "@/lib/types";

import Ionicons from "@expo/vector-icons/Ionicons";
import { AddCircle } from "@solar-icons/react-native/Bold";

import * as ImagePicker from "expo-image-picker";



const USERNAME_MAX_LENGTH = 20;
const USERNAME_ALLOWED_REGEX = /^[a-zA-Z0-9._]+$/;
const ALBUM_GRID_GAP = 12;
const ALBUM_GRID_MIN_ITEM_SIZE = 64;

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
    const [albumGridWidth, setAlbumGridWidth] = useState(0);

    const handleAlbumsGridLayout = useCallback((event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setAlbumGridWidth((currentWidth) => {
            if (Math.abs(currentWidth - width) < 0.5) return currentWidth;
            return width;
        });
    }, []);

    const albumGrid = useMemo(() => {
        if (albumGridWidth <= 0) {
            return {
                columns: 1,
                itemSize: ALBUM_GRID_MIN_ITEM_SIZE,
            };
        }

        const columns = Math.max(
            1,
            Math.floor(
                (albumGridWidth + ALBUM_GRID_GAP) /
                    (ALBUM_GRID_MIN_ITEM_SIZE + ALBUM_GRID_GAP),
            ),
        );
        const totalGap = ALBUM_GRID_GAP * (columns - 1);
        const itemSize = (albumGridWidth - totalGap) / columns;

        return {
            columns,
            itemSize,
        };
    }, [albumGridWidth]);
    const isMounted = useRef(false);

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
        <View style={styles.container}>
            <View style={styles.sec}>
                <Text style={styles.title}>Álbuns favoritos</Text>
                <BottomSheetScrollView
                    // onLayout={handleAlbumsGridLayout}
                    horizontal={true}
                    style={{
                        flexDirection: "row",
                        marginTop: 8,
                        gap: 8,
                        flex: 1,
                    }}
                >
                    {albuns.map((album: any) => (
                        <View
                            key={album.id}
                            style={{
                                width: albumGrid.itemSize,
                                height: albumGrid.itemSize,
                            }}
                        >
                            <Image
                                source={{ uri: album.src }}
                                style={{
                                    width: albumGrid.itemSize,
                                    height: albumGrid.itemSize,
                                    borderRadius: 8,
                                }}
                            />
                            <Pressable
                                style={styles.favCloseBtn}
                                onPress={() => excludeAlbum(album.id)}
                            >
                                {/* <CloseCircle size={24} color="#e4e6e7" /> */}
                                <Ionicons
                                    name="close-sharp"
                                    size={16}
                                    color="black"
                                />
                            </Pressable>
                        </View>
                    ))}

                    {/* <View
                        style={{
                            width: albumGrid.itemSize,
                            height: albumGrid.itemSize,
                            borderRadius: 8,
                            backgroundColor: "rgba(128, 101, 239, 0.1)",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <AddCircle size={32} color="#8065ef" />
                    </View> */}
                </BottomSheetScrollView>
                <View
                    style={{
                        marginTop: 16,
                        width: "100%",
                        flex: 1,
                        maxHeight: "70%",
                    }}
                >
                    <SearchAlbunsInput
                        results={results}
                        setResults={setResults}
                        type="albuns"
                        setLoading={() => {}}
                    />
                    <BottomSheetScrollView
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
                                            .map((artist: any) => artist.name)
                                            .join(", ")}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </BottomSheetScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    sec: {
        borderRadius: 12,
    },
    title: {
        color: "#989898",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8,
    },
    headTitle: {
        color: "#eee",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
    },
    favBtn: {
        position: "relative",
        bottom: 8,
    },
    favCloseBtn: {
        position: "absolute",
        top: -4,
        right: -4,
        backgroundColor: "#e4e6e7",
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
    },
});
