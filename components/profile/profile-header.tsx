import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { UserProfile } from "@/lib/types";
import api, { apiAuth, apiAuthPost } from "@/lib/api";
import { useRouter } from "expo-router";
import { getColors } from "react-native-image-colors";
import { useState, useEffect, use } from "react";
import { Palette } from "@/lib/types";
import { VerifiedCheck } from "@solar-icons/react-native/Bold";
import { LinearGradient } from "expo-linear-gradient";
import { getBannerColors } from "@/lib/util/workWithColors";

export default function ProfileHeader({
    data,
    dominantColor,
    itsUser,
}: {
    data: UserProfile;
    dominantColor: string;
    itsUser?: boolean;
}) {
    const router = useRouter();
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

                const bannerColors = getBannerColors(result);
                console.log("Colors fetched successfully:", bannerColors);
                setColors(bannerColors);
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
                const response = await api(
                    `/users/${data.username}/followings`,
                );
                setFollowingCount(response.data.followings.length);
            } catch (error) {
                console.error("Error fetching following count:", error);
            }
        };
        const fetchReviewsCount = async () => {
            try {
                const response = await api(`/users/${data.username}/reviews`);
                setReviewsCount(response.data.totalReviews);
            } catch (error) {
                console.error("Error fetching reviews count:", error);
            }
        };

        const checkIfFollowing = async () => {
            try {
                const response = await apiAuth(
                    `/users/${data.username}/follow-check`,
                );
                setIsFollowing(response.isFollowing);
                console.log(response);
            } catch (error) {
                console.error("Error checking following status:", error);
            }
        };
        checkIfFollowing();
        fetchFollowersCount();
        fetchFollowingCount();
        fetchReviewsCount();
    }, [data.username]);

    function handleFollowToggle() {
        // Lógica para seguir ou deixar de seguir o usuário
        if (isFollowing) {
            const response = apiAuthPost(`/users/${data.username}/relation`, {
                ACTION: "UNFOLLOW",
            });
            console.log("Deixar de seguir", response);
        } else {
            // Lógica para seguir
            const response = apiAuthPost(`/users/${data.username}/relation`, {
                ACTION: "FOLLOW",
            });
            console.log("Seguir", response);
        }
        setIsFollowing(!isFollowing);
    }

    return (
        <View style={styles.scene}>
            <LinearGradient
                colors={[colors[0], "transparent"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            <LinearGradient
                colors={[colors[1], "transparent"]}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 1 }}
                style={[StyleSheet.absoluteFill]}
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
                    <Text style={styles.textDefault}>
                        {reviewsCount} review{reviewsCount !== 1 && "s"}
                    </Text>
                    <Text style={styles.textDefault}>
                        {followingCount} seguindo
                    </Text>
                    <Text style={styles.textDefault}>
                        {folowersCount} seguidor{folowersCount !== 1 && "es"}
                    </Text>
                </View>
                {itsUser ? (
                    <Pressable style={[styles.followBtn, { backgroundColor: "#8065ef" }]}
                        onPress={() => router.push("/edit-profile")}
                    >
                        <Text style={{ color: "#eee", fontWeight: "bold" }}>
                            Editar perfil
                        </Text>
                    </Pressable>
                ) : (
                    <Pressable
                        style={[
                            styles.followBtn,
                            {
                                backgroundColor: isFollowing
                                    ? "transparent"
                                    : "#8065ef",
                            },
                        ]}
                        onPress={handleFollowToggle}
                    >
                        <Text style={{ color: "#eee", fontWeight: "bold" }}>
                            {isFollowing ? "Seguindo" : "Seguir"}
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
        borderWidth: 1,
        borderColor: "#8065ef",
    },
});
