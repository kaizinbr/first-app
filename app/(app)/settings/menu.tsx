import Menu from "@/components/settings/menu-main";
import api from "@/lib/api";
import { Palette, UserProfile } from "@/lib/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function IndexSettings() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [accountData, setAccountData] = useState<any>(null);
    const [colors, setColors] = useState<Palette | any>(null);
    const [dominantColor, setDominantColor] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await api.get("/me");
                // console.log("Profile data fetched successfully:", response);
                setProfileData(response.data);
                const accountResponse = await api.get("/me/account");
                setAccountData(accountResponse);
                setLoading(false);
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
            {profileData && accountData && (
                <Menu data={profileData} accountData={accountData} />
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
