import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Pressable,
} from "react-native";
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
import Menu from "@/components/settings/menu-main";
import { useRouter } from "expo-router";
import SetPassword from "@/components/settings/set-password";

import {
    AltArrowLeft,
    TrashBinTrash,
    Password,
    LockPassword,
} from "@solar-icons/react-native/Outline";
import { LockPasswordBold, PasswordBold } from "@solar-icons/react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import TextDefault from "@/components/core/text-core";
import UnlinkGoogleBtn from "@/components/settings/unlink-google-btn";

export default function PasswordSettings() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [accountData, setAccountData] = useState<any>(null);
    const [colors, setColors] = useState<Palette | any>(null);
    const [dominantColor, setDominantColor] = useState<string | null>(null);
    const [accounts, setAccounts] = useState<any>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await apiAuth("/me");
                setProfileData(response);

                const userResponse = await apiAuth("/me/user");
                console.log("User data fetched successfully:", userResponse);
                setUserData(userResponse);

                const accountResponse = await apiAuth("/me/account");
                console.log(
                    "Account data fetched successfully:",
                    accountResponse,
                );
                setAccountData(accountResponse);

                const baccounts = await authClient.listAccounts();
                console.log("Accounts fetched successfully:", baccounts);
                setAccounts(baccounts);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    return (
        <>
            <Animated.View
                style={[
                    styles.statusBarBg,
                    {
                        height: insets.top + 24,
                    },
                ]}
                pointerEvents="none"
            >
                <LinearGradient
                    colors={["#161718", "transparent"]}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>
            <Pressable
                onPress={() => router.back()}
                style={[styles.backButton, { top: insets.top + 4 }]}
            >
                <AltArrowLeft size={32} color="#eee" />
            </Pressable>
            {loading ? (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#8065ef" />
                </View>
            ) : null}
            {accounts && (
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View
                        style={[
                            styles.container,
                            { marginTop: insets.top + 32 },
                        ]}
                    >
                        {accounts.data.some(
                            (account: any) => account.providerId === "google",
                        ) ? (
                            <UnlinkGoogleBtn setAccounts={setAccounts} accounts={accounts} />
                        ) : null}

                        {accounts.data.some(
                            (account: any) =>
                                account.providerId === "credential",
                        ) ? (
                            <>
                                <Pressable 
                                    onPress={() => router.push("/(app)/settings/change-password")}
                                    style={[styles.btnBg]}
                                >
                                    <LockPasswordBold size={24} color="#eee" />
                                    <TextDefault style={styles.btnText}>
                                        Alterar minha senha
                                    </TextDefault>
                                </Pressable>
                                <Pressable 
                                    onPress={() => router.push("/(app)/settings/forgot-password")}
                                    style={[styles.btnBg]}
                                >
                                    <LockPasswordBold size={24} color="#eee" />
                                    <TextDefault style={styles.btnText}>
                                        Esqueci minha senha
                                    </TextDefault>
                                </Pressable>
                            </>
                        ) : (
                            <Pressable 
                            onPress={() => router.push("/(app)/settings/set-password")}
                            style={[styles.btnBg]}>
                                <PasswordBold size={24} color="#eee" />
                                <TextDefault style={styles.btnText}>
                                    Definir senha
                                </TextDefault>
                            </Pressable>
                        )}

                        {/* {loading ? (
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
                )} */}
                    </View>
                </KeyboardAvoidingView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        padding: 16,
        gap: 12,
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
    statusBarBg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        zIndex: 10,
    },
    backButton: {
        position: "absolute",
        left: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
    },
    btnBg: {
        backgroundColor: "#212223",
        padding: 12,
        borderRadius: 12,
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    btnText: {
        color: "#eee",
        fontWeight: "600",
    },
});
