import { Text, Image, View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import api from "@/lib/api";

import { useEffect, useState } from "react";

import FeedCard from "@/components/home/feed-card";

import { Review } from "@/lib/types";

export default function Feed() {
    const { data: session } = authClient.useSession();

    const [feedData, setFeedData] = useState<{
        totalReviews: number;
        reviews: Review[];
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedData = async () => {
            try {
                const response = await api.get("/reviews");
                setFeedData(response.data);
                // console.log("Feed data fetched successfully:", response.data);
                // console.log("total reviews:", feedData!.totalReviews);
            } catch (error) {
                console.error("Error fetching feed data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedData();
    }, []);

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.container}
        >
            <Text style={styles.h2}>avaliações</Text>

            <View style={styles.feed}>
                {loading ? (
                    <Text>Carregando avaliações...</Text>
                ) : feedData && feedData.reviews.length > 0 ? (
                    feedData.reviews.map((review) => (
                        <FeedCard key={review.id} review={review} />
                    ))
                ) : (
                    <Text>Nenhuma avaliação encontrada.</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        width: "100%",
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        textAlign: "left",
        marginTop: 32,
    },
    h2: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "left",
        marginTop: 32,
        color: "#eeeeee",
        paddingHorizontal: 16,
    },
    feed: {
        gap: 8,
        marginTop: 20,
        marginBottom: 56,
    },
    feedCard: {
        height: 120,
        width: "100%",
        // backgroundColor: "#eee",
        borderRadius: 8,
    },
    image: {
        width: "100%",
        height: 300,
        marginTop: 20,
        resizeMode: "contain",
    },
    banner: {
        flexDirection: "row",
        gap: 8,
        marginTop: 20,
        height: 120,
    },
    bannerCard: {
        height: 120,
        width: 120,
        backgroundColor: "#eee",
        borderRadius: 8,
    },

    card: {
        width: "100%",
        backgroundColor: "transparent",
        padding: 12,
        borderRadius: 8,
        flexDirection: "row",
        gap: 8,
    },
    cardImage: {
        width: 32,
        height: 32,
        backgroundColor: "#bbb",
        borderRadius: 6,
        marginBottom: 8,
    },
    cardContent: {
        flex: 1,
    },
});
