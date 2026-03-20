import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { UserProfile } from "@/lib/types";
import api, { apiAuth } from "@/lib/api";

import { getColors } from "react-native-image-colors";
import { useState, useEffect, use } from "react";
import { Palette } from "@/lib/types";
import { VerifiedCheck } from "@solar-icons/react-native/Bold";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileHeader({
    data,
    dominantColor,
    itsUser,
}: {
    data: UserProfile;
    dominantColor: string;
    itsUser?: boolean;
}) {
    const [colors, setColors] = useState<Palette | any>({
        dominant: "#8065ef",
        vibrant: "#8065ef",
        darkVibrant: "#8065ef",
        muted: "#8065ef",
    });
    const [folowersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [reviewsCount, setReviewsCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const result = await getColors(data.avatar_url, {
                    fallback: "#000",
                    cache: true,
                    key: data.avatar_url,
                    quality: "low",
                });

                console.log("Colors fetched successfully:", result);
                setColors(result);
            } catch (error) {
                console.error("Error fetching colors:", error);
            }
        };
        fetchColors();
    }, []);

    useEffect(() => {
        const fetchFollowersCount = async () => {
            try {
                const response = await api(`/users/${data.username}/followers`);
                setFollowersCount(response.data.followers.length);
            } catch (error) {   
                console.error("Error fetching followers count:", error);
            }
        };
        const fetchFollowingCount = async () => {
            try {
                const response = await api(`/users/${data.username}/followings`);
                setFollowingCount(response.data.followings.length);
            } catch (error) {
                console.error("Error fetching following count:", error);
            }
        };
        
        const checkIfFollowing = async () => {
            try {                const response = await apiAuth(`/users/${data.username}/follow-check`);
                setIsFollowing(response.data.isFollowing);
            } catch (error) {   
                console.error("Error checking following status:", error);
            }
        };
        checkIfFollowing();
        fetchFollowersCount();
        fetchFollowingCount();
    }, [data.username]);

    // const dominantColor = colors ? selectRightColor(colors) : "#8065ef";

    return (
        <View style={styles.scene}>
            <LinearGradient
                colors={[dominantColor, "#161718"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            <LinearGradient
                colors={[colors.muted, "#161718"]} // Troque pela cor dinâmica do álbum depois
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
            />
            <LinearGradient
                colors={["transparent", "rgba(22,23,24,1)"]}
                start={{ x: 0.5, y: 0.1 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <View style={styles.wrapper}>
                    <Image
                        source={{ uri: data.avatar_url }}
                        style={[
                            styles.avatar,
                            {
                                width: 112,
                                height: 112,
                                borderRadius: 112 * 0.306,
                            },
                        ]}
                    />
                    {data.pronouns && (
                        <View
                            style={[
                                styles.pronouns,
                                // { backgroundColor: dominantColor },
                            ]}
                        >
                            <Text style={styles.pronounstext}>
                                {data.pronouns}
                            </Text>
                        </View>
                    )}
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                    }}
                >
                    <Text style={styles.name}>{data.name}</Text>{" "}
                    {data.verified && (
                        <Text>
                            <VerifiedCheck size={18} color="#8065ef" />
                        </Text>
                    )}
                </View>
                <Text style={styles.username}>@{data.username}</Text>
                <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
                    <Text style={styles.textDefault}>0 reviews</Text>
                    <Text style={styles.textDefault}>{followingCount} seguindo</Text>
                    <Text style={styles.textDefault}>{folowersCount} seguidores</Text>
                </View>
                {itsUser ? (
                    <Pressable style={styles.followBtn}>
                        <Text style={{ color: "#eee", fontWeight: "bold" }}>
                            Editar perfil
                        </Text>
                    </Pressable>
                ) : (
                    <Pressable
                        style={[
                            styles.followBtn,
                            { backgroundColor: "#8065ef" },
                        ]}
                    >
                        <Text style={{ color: "#eee", fontWeight: "bold" }}>
                            Seguir
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scene: {
        overflow: "hidden",
        position: "relative",
    },
    header: {
        padding: 16,
        paddingTop: 84,
        paddingBottom: 32,
        width: "100%",
        alignItems: "center",
    },
    wrapper: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexDirection: "column",
        marginBottom: 28,
    },
    textDefault: {
        color: "#eee", // A cor clara para o seu modo escuro
        fontSize: 14,
    },
    name: {
        fontWeight: "bold",
        color: "#eee",
        fontSize: 18,
        alignItems: "center",
        flexDirection: "row",
        gap: 4,
    },
    username: {
        color: "#b9b9b9",
        fontSize: 14,
    },
    pronouns: {
        color: "#929292",
        fontSize: 12,
        marginTop: 4,
        position: "absolute",
        bottom: -20,
        zIndex: 10,
        backgroundColor: "#8065ef",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    pronounstext: {
        color: "#eee",
        fontSize: 12,
        fontWeight: "bold",
    },
    avatar: {
        backgroundColor: "#bbb",
    },
    followBtn: {
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 9999,
        backgroundColor: "#8065ef",
    },
});
