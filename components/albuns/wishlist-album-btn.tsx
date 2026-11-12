import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import api from "@/lib/api";
import { Playlist2Icon } from '@solar-icons/react-native/bold/playlist-2'
import { Album } from "@/lib/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WishlistAlbumBtn({
    albumData,
    size,
    mainColor,
}: {
    albumData: Album;
    size: number;
    mainColor: string;
}) {
    const [isWishlisted, setIsWishlisted] = useState(false);

    const insets = useSafeAreaInsets();

    useEffect(() => {
        // Verificar se o álbum é favorito do usuário
        async function checkIfFavorite() {
            try {
                const response = await api.get(
                    `/albuns/${albumData.id}/wishlist`,
                );
                console.log("Resposta do favorito:", response);
                setIsWishlisted(response.data.isWishlisted);
            } catch (error) {
                console.error("Erro ao verificar favorito:", error);
            }
        }

        checkIfFavorite();
    }, [albumData.id]);

    const toggleWishlist = async () => {
        try {
            if (isWishlisted) {
                await api.delete(`/albuns/${albumData.id}/wishlist`, {
                    id: albumData.id,
                });
            } else {
                await api.post(`/albuns/${albumData.id}/wishlist`, {
                    albumID: albumData.id,
                    albumName: albumData.name,
                    artistName: albumData.artists[0].name,
                    coverUrl: albumData.images[0].url,
                });
            }
            setIsWishlisted(!isWishlisted);
        } catch (error) {
            console.error("Erro ao alternar favorito:", error);
        }
    };

    return (
        <Pressable
            onPress={toggleWishlist}
            style={({ pressed }) => [
                styles.fav,
                {
                    backgroundColor: pressed ? "#7051ED" : "#8065ef",
                    bottom: insets.bottom,
                },
                isWishlisted ? { backgroundColor: "#5E3BEA" } : {},
            ]}
        >
            <Playlist2Icon size={size} color="#eee" />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    fav: {
        position: "absolute",
        // left: 16,
        right: 16,
        zIndex: 11,
        height: 46,
        width: 46,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1c494f",
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
});
