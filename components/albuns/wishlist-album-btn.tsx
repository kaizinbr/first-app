import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useState, useEffect } from "react";

import { apiAuth, apiAuthPost, apiAuthDELETE } from "@/lib/api";
import { Album, Palette, UserProfile } from "@/lib/types";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { lightenColor, darkenColor } from "@/lib/util/workWithColors";
import { AltArrowLeft, Star } from "@solar-icons/react-native/Outline";
import { Star as StarBold } from "@solar-icons/react-native/Bold";
import { Playlist2 } from "@solar-icons/react-native/Bold";

export default function WishlistAlbumBtn({
    albumData,
    size,
    colors,
}: {
    albumData: Album;
    size: number;
    colors: Palette;
}) {
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        // Verificar se o álbum é favorito do usuário
        async function checkIfFavorite() {
            try {
                const response = await apiAuth(
                    `/albuns/${albumData.id}/wishlist`,
                );
                console.log("Resposta do favorito:", response);
                setIsWishlisted(response.isWishlisted);
            } catch (error) {
                console.error("Erro ao verificar favorito:", error);
            }
        }

        checkIfFavorite();
    }, [albumData.id]);

    const toggleWishlist = async () => {
        try {
            if (isWishlisted) {
                await apiAuthDELETE(`/albuns/${albumData.id}/wishlist`, {
                    id: albumData.id,
                });
            } else {
                await apiAuthPost(`/albuns/${albumData.id}/wishlist`, {
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
                    backgroundColor: pressed
                        ? "#7051ED"
                            : "#8065ef",
                },
                isWishlisted
                    ? {backgroundColor: "#5E3BEA"}
                    : {},
            ]}
        >
            <Playlist2 size={size} color="#eee" />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    fav: {
        position: "absolute",
        // left: 16,
        right: 16,
        bottom: 64,
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
