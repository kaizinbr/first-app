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
    ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import api, { apiAuth } from "@/lib/api";
import { useEffect, useState } from "react";
import ProfileTabs from "@/components/profile/profile-tabs";
import { authClient } from "@/lib/auth-client";
import { Album, UserProfile } from "@/lib/types";

import { getColors } from "react-native-image-colors";
import { getPalette, getColor } from "expo-color-thief-native";

import { Palette } from "@/lib/types";

import AlbumScreen from "@/components/albuns/main";

export default function AlbumPage() {
    const { id } = useLocalSearchParams();
    console.log("id from params:", id);

    const [userData, setUserData] = useState<any>(null);
    const [albumData, setAlbumData] = useState<Album | null>(null);

    const [colors, setColors] = useState<Palette | any>(null);
    const [palette, setPalette] = useState<Palette | any>(null);

    useEffect(() => {
        const fetchAlbumData = async () => {
            setAlbumData(null);
            // console.log("Fetching album data for id:", id, albumData);
            try {
                const response = await apiAuth(`/albuns/${id}`);
                const user = await apiAuth("/me");
                setUserData(user);
                // console.log("Album data fetched successfully:", response);
                setAlbumData(response);
                if (response.images && response.images.length > 0) {
                    const imageUrl = response.images[0].url;
                    
                    const palette = await getPalette(imageUrl, { quality: 10 });
                    setPalette(palette);
                    console.log("Palette fetched successfully:", palette);
                }
            } catch (error) {
                console.error("Error fetching album data:", error);
            }
        };
        fetchAlbumData();
    }, [id]);

    return (
        <>
            {albumData && palette ? (
                <AlbumScreen
                    albumData={albumData}
                    userData={userData}
                    palette={palette}
                />
            ) : (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#8065ef" />
                </View>
            )}
        </>
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
        marginBottom: 100,
    },
    main: {
        flex: 1,
        backgroundColor: "#161718",
        color: "#eeeeee",
        paddingTop: 16,
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
        color: "#eee",
    },
    image: {
        width: 300,
        height: 300,
        marginTop: 20,
        resizeMode: "contain",
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
