import { Text, View, StyleSheet } from "react-native";
import { Review } from "@/lib/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import { useRouter, Href, Link } from "expo-router";
import api from "@/lib/api";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import TiptapRenderer from "@/components/home/card-content copy";

export default function ReviewContent({ review }: { review: Review }) {
    const [content, setContent] = useState<{
        jsonContent: any;
        html: string;
    } | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            if (!review.shorten) {
                console.error("Review shorten is undefined");
                return;
            }

            if (
                !Array.isArray(review.content.content) ||
                review.content.content.length === 0 ||
                !Array.isArray(review.content.content[0].content) ||
                review.content.content[0].content.length === 0 ||
                review.content.content[0].content[0].text === ""
            ) {
                console.warn("Review content is empty");
                return;
            }

            try {
                const response = await api.get(
                    `/reviews/${review.shorten}/content`,
                );
                setContent(response.data);
            } catch (error) {
                console.error("Error fetching content:", error);
            }
        };

        fetchContent();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <Image
                    source={{ uri: review.Profile.avatar_url! }}
                    style={styles.cardImage}
                />
                <View style={{ marginLeft: 8 }}>
                    <Text style={styles.sectionTitle}>
                        {review.Profile.name}
                    </Text>
                    <Text style={styles.date}>
                        @{review.Profile.username}
                    </Text>
                </View>
            </View>
            {content ? (
                <>
                    <TiptapRenderer json={content.jsonContent} />
                </>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        alignContent: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        marginTop: 16,
    },
    top: {
        flex: 1,
        flexDirection: "row"
    },


    cardImage: {
        width: 38,
        height: 38,
        backgroundColor: "#bbb",
        borderRadius: 38 * 0.306,
        marginBottom: 8,
    },
    sectionTitle: { color: "#fff", fontSize: 14, fontWeight: "bold", marginTop: 2 },
    date: { color: "#777", fontSize: 12, },
});
