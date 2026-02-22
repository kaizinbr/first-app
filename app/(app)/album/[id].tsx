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

export default function AlbumPage() {
    const { id } = useLocalSearchParams();
    console.log("id from params:", id);

    const [albumData, setAlbumData] = useState<Album | null>(null);

    useEffect(() => {
        const fetchAlbumData = async () => {
            setAlbumData(null);
            console.log("Fetching album data for id:", id, albumData);
            try {
                const response = await apiAuth(`/albuns/${id}`);
                // console.log("Album data fetched successfully:", response);
                setAlbumData(response);
                // console.log("Updated albumData state:", albumData);
            } catch (error) {
                console.error("Error fetching album data:", error);
            }
        };
        fetchAlbumData();
    }, [id]);

    return (
        <View style={styles.container}>
            {albumData ? (
                <View style={styles.main}>
                    <Text style={styles.title}>{albumData.name}</Text>
                    <Text style={styles.textDefault}>{albumData.artists.map(artist => artist.name).join(", ")}</Text>
                    <Image
                        source={{ uri: albumData.images[0].url }}
                        style={styles.image}
                    />

                </View>
            ) : (
                <Text style={styles.textDefault}>Loading album data...</Text>
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
