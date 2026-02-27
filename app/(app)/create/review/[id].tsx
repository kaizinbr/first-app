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
    TextInput,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import api, { apiAuth } from "@/lib/api";
import { useEffect, useState } from "react";
import ProfileTabs from "@/components/profile/profile-tabs";
import { authClient } from "@/lib/auth-client";
import { Album, Review } from "@/lib/types";
import PostEditor from "@/components/reviews/rich-text";

export default function ReviewPage() {
    const { id } = useLocalSearchParams();
    console.log("id from params:", id);

    const [reviewData, setReviewData] = useState<{
        reviewed: boolean;
        rating: Review | null;
        albumData: Album;
    } | null>(null);

    useEffect(() => {
        const fetchReviewData = async () => {
            setReviewData(null);
            // console.log("Fetching review data for id:", id, reviewData);
            try {
                const response = await apiAuth(`/me/reviewed/${id}`);
                // console.log("Album data fetched successfully:", response);
                setReviewData(response);
                // console.log("Updated albumData state:", albumData);
            } catch (error) {
                console.error("Error fetching album data:", error);
            }
        };
        fetchReviewData();
    }, [id]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            {reviewData ? (
                <View style={styles.main}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {reviewData.albumData.name}
                        </Text>
                        <Text style={styles.textDefault}>
                            {reviewData.albumData.artists
                                .map((artist) => artist.name)
                                .join(", ")}
                        </Text>
                        <Image
                            source={{ uri: reviewData.albumData.images[0].url }}
                            style={styles.image}
                        />
                    </View>
                    <View style={styles.textSec}>
                        <Text style={styles.textDefault}>
                            {reviewData.reviewed ? "Reviewed" : "Not reviewed"}
                        </Text>
                    </View>
                    <View style={styles.textSec}>
                        <Text style={styles.textDefault}>Nota:</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite a nota (0-5)"
                                keyboardType="numeric"
                            />
                            <Text style={styles.inputSide}>/100</Text>
                        </View>
                    </View>
                    <View style={styles.textSec}>
                        <PostEditor />
                    </View>
                </View>
            ) : (
                <Text style={styles.textDefault}>Loading album data...</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
    },
    main: {
        flex: 1,
        backgroundColor: "#161718",
        color: "#eeeeee",
        alignItems: "center",
        width: "100%",
        paddingTop: 16,
        justifyContent: "flex-start",
    },
    header: {
        padding: 16,
        width: "100%",
        color: "#eee",
        borderRadius: 8,
    },
    textSec: {
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
        width: 150,
        height: 150,
        marginTop: 20,
        resizeMode: "contain",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    input: {
        fontSize: 24,
        color: "#eeeeee",
    },
    inputSide: {
        fontSize: 24,
        color: "#eeeeee",
    },
});
