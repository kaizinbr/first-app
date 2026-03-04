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
import { Artist } from "@/lib/types";

export default function ArtistPage() {
    const { id } = useLocalSearchParams();
    console.log("id from params:", id);

    const [artistData, setArtistData] = useState<Artist | null>(null);

    useEffect(() => {
        const fetchArtistData = async () => {
            setArtistData(null);
            try {
                const response = await apiAuth(`/artists/${id}`);
                // console.log("Artist data fetched successfully:", response);
                setArtistData(response);
                // console.log("Updated artistData state:", artistData);
            } catch (error) {
                console.error("Error fetching artist data:", error);
            }
        };
        fetchArtistData();
    }, [id]);

    return (
        <View style={styles.container}>
            {artistData ? (
                <View style={styles.main}>
                    <Text style={styles.title}>{artistData.name}</Text>
                    <Image
                        source={{ uri: artistData.images[0].url }}
                        style={styles.image}
                    />

                </View>
            ) : (
                <Text style={styles.textDefault}>Loading artist data...</Text>
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
