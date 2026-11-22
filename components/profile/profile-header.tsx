import TextDefault from "@/components/core/text-core";
import api from "@/lib/api";
import { Palette, UserProfile } from "@/lib/types";
import { selectBackgroundColor } from "@/lib/util/selectRightColor";
import { getPalette } from "expo-color-thief-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
} from "react-native-reanimated";
import type { ColorThiefColorData } from "expo-color-thief-native";

import PlayingOnLastFM from "@/components/profile/last-fm-card";
import ProfileHeaderBG from "@/components/profile/profile-header-bg";
import { VerifiedCheckIcon } from '@solar-icons/react-native/bold/verified-check'
import { Pressable, StyleSheet, Text, View } from "react-native";
import ProfileImage from "@/components/profile/profile-image";

export default function ProfileHeader({
    data,
    itsUser,
    style,
    palette,
}: {
    data: UserProfile;
    itsUser?: boolean;
    style?: any;
    palette?: ColorThiefColorData[];
}) {
    const router = useRouter();
    const [folowersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [reviewsCount, setReviewsCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);

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
                const response = await api.get(
                    `/users/${data.username}/follow-check`,
                );
                setIsFollowing(response.data.isFollowing);
                console.log(response.data);
            } catch (error) {
                console.error("Error checking following status:", error);
            }
        };
        checkIfFollowing();
        fetchFollowersCount();
        fetchFollowingCount();
        fetchReviewsCount();
    }, [data.username, data]);

    function handleFollowToggle() {
        // Lógica para seguir ou deixar de seguir o usuário
        if (isFollowing) {
            const response = api.post(`/users/${data.username}/relation`, {
                ACTION: "UNFOLLOW",
            });
            console.log("Deixar de seguir", response);
        } else {
            // Lógica para seguir
            const response = api.post(`/users/${data.username}/relation`, {
                ACTION: "FOLLOW",
            });
            console.log("Seguir", response);
        }
        setIsFollowing(!isFollowing);
    }

    return (
        <Animated.View style={[styles.scene, style]}>
            <ProfileHeaderBG avatar_url={data.avatar_url} />

            <View style={styles.header}>
                <ProfileImage data={data} />

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                    }}
                >
                    <TextDefault style={styles.name}>{data.name}</TextDefault>
                    {data.verified && (
                        <TextDefault>
                            <VerifiedCheckIcon size={18} color="#8065ef" />
                        </TextDefault>
                    )}
                </View>
                <Text style={styles.username}>@{data.username}</Text>
                <View style={{ flexDirection: "row", gap: 16, marginTop: 12 }}>
                    <TextDefault style={styles.textDefault}>
                        {reviewsCount} review{reviewsCount !== 1 && "s"}
                    </TextDefault>
                    <TextDefault style={styles.textDefault}>
                        {followingCount} seguindo
                    </TextDefault>
                    <TextDefault style={styles.textDefault}>
                        {folowersCount} seguidor{folowersCount !== 1 && "es"}
                    </TextDefault>
                </View>
                {itsUser ? (
                    <Pressable
                        style={[
                            styles.followBtn,
                            { backgroundColor: "#8065ef" },
                        ]}
                        onPress={() => router.push("/edit-profile")}
                    >
                        <TextDefault
                            style={{ color: "#eee", fontWeight: "bold" }}
                        >
                            Editar perfil
                        </TextDefault>
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
                        <TextDefault
                            style={{ color: "#eee", fontWeight: "bold" }}
                        >
                            {isFollowing ? "Seguindo" : "Seguir"}
                        </TextDefault>
                    </Pressable>
                )}

                <PlayingOnLastFM data={data} />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    scene: {
        overflow: "hidden",
        position: "relative",
        zIndex: 99,
    },
    header: {
        padding: 16,
        paddingTop: 112,
        paddingBottom: 32,
        width: "100%",
        alignItems: "center",
    },
    gradientContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0, // Fica atrás do ScrollView
    },
    blob: {
        // position: "absolute",
        borderRadius: 9999,
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
        marginTop: 4,
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
        paddingVertical: 12,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: "#8065ef",
    },

    lastWrapper: {
        marginTop: 12,
        backgroundColor: "rgba(128, 101, 239, 0.2)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    lastUsername: {
        color: "#eee",
        fontSize: 12,
    },
});
