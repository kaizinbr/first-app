import TextDefault from "@/components/core/text-core";
import api from "@/lib/api";
import { Palette, UserProfile } from "@/lib/types";
import { AltArrowLeftIcon } from "@solar-icons/react-native/outline/alt-arrow-left";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as Application from "expo-application";

export default function IndexSettings() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
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
                setUserData(userResponse);
                const accountResponse = await api.get("/me/account");
                setAccountData(accountResponse);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    const FIXED_BAR_HEIGHT = insets.top + 50;

    return (
        <View style={[styles.container, { paddingTop: FIXED_BAR_HEIGHT }]}>
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
                <AltArrowLeftIcon size={32} color="#eee" />
            </Pressable>

            <View style={[styles.section, { padding: 16 }]}>
                <TextDefault style={[styles.textDefault, styles.title]}>
                    Nome do App
                </TextDefault>
                <TextDefault style={[styles.textDefault, { marginBottom: 16 }]}>
                    {Application.applicationName}
                </TextDefault>
                <TextDefault style={[styles.textDefault, styles.title]}>
                    Pacote
                </TextDefault>
                <TextDefault style={[styles.textDefault, { marginBottom: 16 }]}>
                    {Application.applicationId}
                </TextDefault>
                <TextDefault style={[styles.textDefault, styles.title]}>
                    Versão do App
                </TextDefault>
                <TextDefault style={[styles.textDefault, { marginBottom: 16 }]}>
                    {Application.nativeApplicationVersion}
                </TextDefault>
                <TextDefault style={[styles.textDefault, styles.title]}>
                    Versão dev
                </TextDefault>
                <TextDefault style={[styles.textDefault]}>
                    {Application.nativeBuildVersion}
                </TextDefault>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        padding: 16,
        width: "100%",
    },

    textDefault: {
        color: "#eee", // A cor clara para o seu modo escuro
        fontSize: 16,
    },
    statusBarBg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        zIndex: 10,
    },
    title: {
        color: "#989898",
        fontSize: 14,
        fontWeight: "bold",
    },
    section: {
        backgroundColor: "#212223",
        padding: 0,
        borderRadius: 12,
        overflow: "hidden",
    },
    button: {
        backgroundColor: "transparent",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    divider: {
        height: 1,
        backgroundColor: "#2c2d2e",
        marginHorizontal: 16,
    },
    backButton: {
        position: "absolute",
        left: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
        // backgroundColor: "rgba(255,255,255,0.05)",
    },
});
