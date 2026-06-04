import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import * as Linking from 'expo-linking';
import { EnrichedMarkdownText } from "react-native-enriched-markdown";
import { truncateMarkdown } from "@/lib/util/truncate";

import { Review } from "@/lib/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import { useRouter, Href, Link } from "expo-router";
import api from "@/lib/api";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import TextDefault from "@/components/core/text-core";
import Avatar from "@/components/core/avatar";

export default function ReviewContent({ review }: { review: Review }) {
    const router = useRouter();
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
                const response = await api.get(`/reviews/${review.id}/content`);
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
                <Avatar
                    data={review.Profile}
                    style={styles.cardImage}
                    size={38}
                />
                <View style={{ marginLeft: 8 }}>
                    <Pressable
                        onPress={() =>
                            router.push({
                                pathname: "/(app)/(tabs)/(home)/user/[username]",
                                params: { username: review.Profile.username },
                            })
                        }
                    >
                        <TextDefault style={styles.sectionTitle}>
                            {review.Profile.name}
                        </TextDefault>
                    </Pressable>
                    <TextDefault style={styles.date}>
                        @{review.Profile.username}
                    </TextDefault>
                </View>
            </View>
            <EnrichedMarkdownText
                markdown={review.review}
                onLinkPress={({ url }) => {
                    if (url.startsWith("http")) {
                        Linking.openURL(url);
                    } else {
                        router.push({
                            pathname: "/(app)/(tabs)/(drafts)/user/[username]",
                            params: { username: url.replace("@", "") },
                        });
                    }
                }}
                markdownStyle={{
                    paragraph: {
                        color: "#fff",
                        fontSize: 14,
                        marginTop: 4,
                        lineHeight: 20,
                        fontFamily: "Walsheim",
                        fontWeight: "400",
                    },
                    h1: {
                        color: "#fff",
                        fontSize: 18,
                        fontWeight: "bold",
                        lineHeight: 24,
                        marginTop: 8,
                    },
                    h2: {
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "bold",
                        marginTop: 4,
                        lineHeight: 20,
                    },
                }}
                //   onLinkPress={({ url }) => Linking.openURL(url)}
            />
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
        flexDirection: "row",
    },

    cardImage: {
        width: 38,
        height: 38,
        backgroundColor: "#bbb",
        borderRadius: 38 * 0.306,
        marginBottom: 8,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 2,
    },
    date: { color: "#777", fontSize: 12 },
});
