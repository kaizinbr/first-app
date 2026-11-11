import ProfileTabs from "@/components/profile/profile-tabs";
import api from "@/lib/api";
import { Palette, UserProfile } from "@/lib/types";
import { selectBackgroundColor } from "@/lib/util/selectRightColor";
import { getPalette } from "expo-color-thief-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [colors, setColors] = useState<Palette | any>(null);
    const [dominantColor, setDominantColor] = useState<string | null>(null);

    const [reload, setReload] = useState(false);
    const fetchProfileData = async () => {
        try {
            const response = await api.get("/me");
            // console.log("Profile data fetched successfully:", response);
            setProfileData(response.data);

            getPalette(response.data.avatar_url, {
                colorCount: 6,
                quality: 10,
            })
                .then((fetchedColors) => {
                    setDominantColor(
                        selectBackgroundColor(fetchedColors).background,
                    );
                    setColors(fetchedColors);

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
                    fetchProfileData={fetchProfileData}
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
