import Button from "@/components/button";
import Input from "@/components/input";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import api, { apiAuth } from "@/lib/api";
import { useEffect, useState } from "react";
import ProfileTabs from "@/components/profile/profile-tabs";
import { authClient } from "@/lib/auth-client";
import { UserProfile } from "@/lib/types";
import { getColors } from "react-native-image-colors";
import { darkenColor } from "@/lib/util/workWithColors";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { Palette } from "@/lib/types";
import { SkeletonProfile } from "@/components/core/skeletons";

export default function UserProfilePage() {
    const { username } = useLocalSearchParams();
    console.log("Username from params:", username);

    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [colors, setColors] = useState<Palette | any>(null);
    const [dominantColor, setDominantColor] = useState<string | null>(null);
    const [itsMe, setItsMe] = useState(false);

    const { data: session } = authClient.useSession();
    console.log("Current session username:", session);
    const fetchProfileData = async () => {
        try {
            const response = await apiAuth(`/users/${username}`);
            console.log("Profile data fetched successfully:", response);
            setProfileData(response);
            console.log("Updated profileData state:", profileData);

            if (response.id === session?.user?.id) {
                setItsMe(true);
            }

            getColors(response.avatar_url, {
                fallback: "#000",
                cache: true,
                key: response.avatar_url,
            })
                .then((colors) => {
                    const newColor = darkenColor(
                        selectRightColor(colors as any),
                        0.5,
                    );
                    console.log("Colors fetched for profile avatar:", colors);
                    console.log("Darkened color:", newColor);
                    setDominantColor(newColor);
                    setColors(colors);
                    setTimeout(() => {
                        setLoading(false);
                    }, 2000);
                })
                .catch(console.error);
        } catch (error) {
            console.error("Error fetching profile data:", error);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProfileData();
    }, [username]);

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#8065ef" />
                </View>
            ) : null}
            {profileData && dominantColor && colors && (
                <View style={styles.main}>
                    <ProfileTabs
                        data={profileData}
                        dominantColor={dominantColor}
                        colors={colors}
                        itsUser={itsMe}
                        fetchProfileData={fetchProfileData}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: "#161718",
        color: "#eeeeee",
        alignItems: "center",
        width: "100%",
    },
    main: {
        flex: 1,
        backgroundColor: "#161718",
        color: "#eeeeee",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        padding: 16,
        width: "100%",
        color: "#eee",
        borderRadius: 8,
    },
    textDefault: {
        color: "#eee", // A cor clara para o seu modo escuro
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
    },
    image: {
        width: "100%",
        height: 300,
        marginTop: 20,
        resizeMode: "contain",
    },
    overlayContainer: {
        flex: 1,
        justifyContent: "center",
    },
    overlay: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        backgroundColor: "#161718",
        zIndex: 10,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});
