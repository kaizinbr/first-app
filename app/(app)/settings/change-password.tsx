import Password from "@/components/settings/change-password";
import api from "@/lib/api";
import { Palette, UserProfile } from "@/lib/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
} from "react-native";

export default function PasswordSettings() {
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
                setProfileData(response.data);

                const userResponse = await api.get("/me/user");
                // console.log("User data fetched successfully:", userResponse);
                setUserData(userResponse);

                const accountResponse = await api.get("/me/account");
                console.log(
                    "Account data fetched successfully:",
                    accountResponse,
                );
                setAccountData(accountResponse);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.overlay}>
                        <ActivityIndicator size="large" color="#8065ef" />
                    </View>
                ) : null}
                {profileData && userData && accountData && (
                    <Password
                        data={profileData}
                        userData={userData}
                        accountData={accountData}
                    />
                )}
            </View>
        </KeyboardAvoidingView>
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
