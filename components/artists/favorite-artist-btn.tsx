import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useState, useEffect } from "react";

import { apiAuth, apiAuthPost, apiAuthDELETE } from "@/lib/api";
import { Artist, Palette, UserProfile } from "@/lib/types";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { lightenColor, darkenColor } from "@/lib/util/workWithColors";
import { AltArrowLeft, Star } from "@solar-icons/react-native/Outline";
import { Star as StarBold } from "@solar-icons/react-native/Bold";

export default function FavoriteArtistBtn({
    artistData,
    size,
}: {
    artistData: Artist;
    size: number;
}) {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        // Verificar se o álbum é favorito do usuário
        async function checkIfFavorite() {
            try {
                const response = await apiAuth(
                    `/artists/${artistData.id}/favorite`,
                );
                console.log("Resposta do favorito:", response);
                setIsFavorite(response.isFavorite);
            } catch (error) {
                console.error("Erro ao verificar favorito:", error);
            }
        }

        checkIfFavorite();
    }, [artistData.id]);

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                await apiAuthDELETE(`/artists/${artistData.id}/favorite`, {
                    id: artistData.id,
                });
            } else {
                await apiAuthPost(`/artists/${artistData.id}/favorite`, {
                    artists: {
                        id: artistData.id,
                        src: artistData.images[0].url,
                        name: artistData.name,
                    },
                });
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Erro ao alternar favorito:", error);
        }
    };

    return (
        <Pressable
            onPress={toggleFavorite}
            // style={}
        >
            {isFavorite ? (
                <StarBold color="#FFD700" size={size} />
            ) : (
                <Star size={size} color="#eee" />
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718", // Cor de fundo do resto do app
    },
    gradientContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0, // Fica atrás do ScrollView
    },
    fixedTopBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#1c494f", // Cor final da barrinha
        zIndex: 10,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    fixedTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    backButton: {
        position: "absolute",
        left: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
    },
    favoriteBtn: {
        position: "absolute",
        right: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
    },
    reviewButton: {
        position: "absolute",
        left: 16,
        right: 70,
        bottom: 64,
        zIndex: 11,
        height: 46,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1c494f",
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
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

    lowerContent: {
        backgroundColor: "#161718", // A mesma cor que o gradiente termina
        paddingHorizontal: 20,
        paddingTop: 24,
        minHeight: 1000,
    },
    sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    score: { color: "#fff", fontSize: 36, fontWeight: "900", marginTop: 8 },
    date: { color: "#777", fontSize: 14, marginTop: 4 },
    fakeReviewCard: {
        height: 80,
        backgroundColor: "#1e1e1e",
        borderRadius: 8,
        marginTop: 12,
    },
    moreData: {
        marginTop: 24,
        padding: 16,
        backgroundColor: "#1e1e1e",
    },
    extraInfo: {
        color: "#777",
        fontSize: 14,
    },
});
