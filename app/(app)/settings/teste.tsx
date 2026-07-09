import { EnrichedMarkdownText } from "react-native-enriched-markdown";
import {
    Linking,
    StyleSheet,
    View,
    Pressable,
    ActivityIndicator,
} from "react-native";

import { authClient } from "@/lib/auth-client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TextDefault from "@/components/core/text-core";
import { useRouter, Href, Link } from "expo-router";
import ProfileHeader from "@/components/profile/profile-header";
import { apiAuth, apiAuthDELETE } from "@/lib/api";
import { Image } from "expo-image";
import { Palette, UserProfile } from "@/lib/types";
import { getColors } from "react-native-image-colors";
import { darkenColor } from "@/lib/util/workWithColors";
import { selectRightColor } from "@/lib/util/selectRightColor";


export default function CommentCard() {
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [colors, setColors] = useState<Palette | any>(null);
    const [dominantColor, setDominantColor] = useState<string | null>(null);

    const [reload, setReload] = useState(false);
    const fetchProfileData = async () => {
        try {
            const response = await apiAuth("/me");
            // console.log("Profile data fetched successfully:", response);
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

                    // setTimeout(() => {
                    // }, 2000);
                        setLoading(false);
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

            {profileData && dominantColor && colors ? (
                <ProfileHeader
                    data={profileData}
                    dominantColor={dominantColor!}
                    itsUser={true}
                />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718",
        padding: 16,
    },
    text: {
        flex: 1,
        fontSize: 15,
        color: "#fff",
        maxHeight: 100, // limita a altura máxima
        minHeight: 28,
    },
    main: {
        width: "100%",
        backgroundColor: "transparent",
        borderRadius: 8,
    },
    mainPressed: {
        backgroundColor: "#1e1e1e",
    },
    card: {
        width: "100%",
        flex: 1,
        backgroundColor: "transparent",
        color: "#eee",
        paddingHorizontal: 16,
        paddingTop: 160,
        paddingBottom: 8,
        borderRadius: 8,
        flexDirection: "row",
        gap: 8,
    },
    cardImage: {
        width: 40,
        height: 40,
        backgroundColor: "#bbb",
        borderRadius: 40 * 0.306,
        marginBottom: 8,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontWeight: 500,
        color: "#eee",
        marginTop: 4,
        fontSize: 14,
        // wordWrap: "break-word",
    },
    albumSection: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 12,
        color: "#eee",
        padding: 12,
        backgroundColor: "#1e1e1e",
        borderRadius: 8,
        borderColor: "#333",
        borderWidth: 0.5,
    },
    albumSectionValue: {
        fontWeight: 900,
        color: "#eee",
        fontSize: 20,
    },
    albumSectionText: {
        color: "#eee",
        fontSize: 12,
        marginTop: 6,
    },
    cardDate: {
        marginTop: 8,
        color: "#aaa",
        fontSize: 12,
    },
    readMore: {
        marginTop: 8,
        color: "#8065ef",
        fontSize: 14,
        fontWeight: "bold",
    },

    sheetView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
    },
    optBtn: {
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: "transparent",
        padding: 12,
        width: "100%",
        borderRadius: 8,
    },
    optText: {
        color: "#eee",
        fontSize: 14,
        marginLeft: 12,
    },
    extraInfo: {
        color: "#777",
        fontSize: 14,
    },
    buttonSection: {
        marginTop: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
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
