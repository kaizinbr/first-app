import Button from "@/components/button";
import Input from "@/components/input";
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Image,
    Platform,
    Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import api, { apiAuth } from "@/lib/api";
import { useEffect, useState } from "react";
import ProfileTabs from "@/components/profile/profile-tabs";
import { authClient } from "@/lib/auth-client";
import { UserProfile } from "@/lib/types";

export default function UserProfilePage() {
    const { username } = useLocalSearchParams();
    console.log("Username from params:", username);

    const [profileData, setProfileData] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            setProfileData(null);
            console.log("Fetching profile data for username:", username, profileData);
            try {
                const response = await apiAuth(`/users/${username}`);
                console.log("Profile data fetched successfully:", response);
                setProfileData(response);
                console.log("Updated profileData state:", profileData);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchProfileData();
    }, [username]);

    return (
        <View style={styles.container}>
            {profileData ? (
                <View style={styles.main}>
                    <ProfileTabs data={profileData} />
                </View>
            ) : (
                <Text style={styles.textDefault}>Loading profile data...</Text>
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
});
