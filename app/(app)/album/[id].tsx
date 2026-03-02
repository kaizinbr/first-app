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
import { Album } from "@/lib/types";

import { getColors } from "react-native-image-colors";

import { Palette } from "@/lib/types";

export default function AlbumPage() {
    const { id } = useLocalSearchParams();
    console.log("id from params:", id);

    const [albumData, setAlbumData] = useState<Album | null>(null);

    const [colors, setColors] = useState<Palette | any>(null);

    useEffect(() => {
        const fetchAlbumData = async () => {
            setAlbumData(null);
            // console.log("Fetching album data for id:", id, albumData);
            try {
                const response = await apiAuth(`/albuns/${id}`);
                // console.log("Album data fetched successfully:", response);
                setAlbumData(response);
                if (response.images && response.images.length > 0) {
                    const imageUrl = response.images[0].url;
                    const colors = await getColors(imageUrl, {
                        fallback: "#1e1e1e",
                        cache: true,
                        key: imageUrl,
                    });
                    setColors(colors);
                    // console.log("Colors fetched for album image:", colors);
                }
            } catch (error) {
                console.error("Error fetching album data:", error);
            }
        };
        fetchAlbumData();
    }, [id]);

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            // style={{
            //     width: "100%",
            //     height: "100%",
            //     position: "absolute",
            //     top: statusHeight,
            //     left: 0,
            //     overflow: "visible",
            // }}
        >
            <View style={styles.container}>
                {albumData ? (
                    <View style={styles.main}>
                        <Text style={styles.title}>{albumData.name}</Text>
                        <Text style={styles.textDefault}>
                            {albumData.artists
                                .map((artist) => artist.name)
                                .join(", ")}
                        </Text>
                        <Image
                            source={{ uri: albumData.images[0].url }}
                            style={styles.image}
                        />
                        <View style={{ width: "100%", marginTop: 20 }}>
                            <Text style={styles.textDefault}>
                                react-native-image-colors
                            </Text>
                            {colors && (
                                <>
                                    <View
                                        style={{
                                            backgroundColor: colors.dominant,
                                            height: 50,
                                            borderRadius: 8,
                                            marginBottom: 10,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text style={styles.textDefault}>
                                            dominante
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            backgroundColor: colors.average,
                                            height: 50,
                                            borderRadius: 8,
                                            marginBottom: 10,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text style={styles.textDefault}>
                                            average
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            backgroundColor: colors.vibrant,
                                            height: 50,
                                            borderRadius: 8,
                                            marginBottom: 10,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text style={styles.textDefault}>
                                            vibrant
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            backgroundColor: colors.darkVibrant,
                                            height: 50,
                                            borderRadius: 8,
                                            marginBottom: 10,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text style={styles.textDefault}>
                                            darkVibrant
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            backgroundColor:
                                                colors.lightVibrant,
                                            height: 50,
                                            borderRadius: 8,
                                            marginBottom: 10,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text style={styles.textDefault}>
                                            lightVibrant
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            backgroundColor: colors.darkMuted,
                                            height: 50,
                                            borderRadius: 8,
                                            marginBottom: 10,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text style={styles.textDefault}>
                                            darkMuted
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            backgroundColor: colors.lightMuted,
                                            height: 50,
                                            borderRadius: 8,
                                            marginBottom: 10,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text style={styles.textDefault}>
                                            lightMuted
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            backgroundColor: colors.muted,
                                            height: 50,
                                            borderRadius: 8,
                                            marginBottom: 10,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text style={styles.textDefault}>
                                            muted
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>

                    </View>
                ) : (
                    <Text style={styles.textDefault}>
                        Loading album data...
                    </Text>
                )}
            </View>
        </ScrollView>
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
});
