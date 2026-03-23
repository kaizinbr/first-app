import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Button from "@/components/button";
import { authClient } from "@/lib/auth-client";
import api, { apiAuth } from "@/lib/api";
import { useEffect, useState } from "react";
import ProfileTabs from "@/components/profile/profile-tabs";
import { UserProfile } from "@/lib/types";
import { getColors } from "react-native-image-colors";
import { darkenColor } from "@/lib/util/workWithColors";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { Palette } from "@/lib/types";
import { SkeletonProfile } from "@/components/core/skeletons";
export default function Index() {
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [colors, setColors] = useState<Palette | any>(null);
    const [dominantColor, setDominantColor] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await apiAuth("/me");
                console.log("Profile data fetched successfully:", response);
                setProfileData(response);

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
                        setDominantColor(newColor);
                        setColors(colors);
                        setTimeout(() => {
                            setLoading(false);
                        }, 2000);
                    })
                    .catch(console.error);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchProfileData();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#8065ef" />
                </View>
            ) : null}
            {profileData && dominantColor && colors && (
                <ProfileTabs
                    data={profileData}
                    dominantColor={dominantColor}
                    colors={colors}
                    itsUser={true}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
