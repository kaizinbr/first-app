import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { UserProfile } from "@/lib/types";

import { getColors } from "react-native-image-colors";
import { useState, useEffect } from "react";
import { Palette } from "@/lib/types";

export default function ProfileHeader({ data }: { data: UserProfile }) {
    const [colors, setColors] = useState<Palette | any>(null);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const result = await getColors(data.avatar_url, {
                    fallback: "#000",
                    cache: true,
                    key: data.avatar_url,
                });
                setColors(result);
            } catch (error) {
                console.error("Error fetching colors:", error);
            }
        };
        fetchColors();
    }, []);

    return (
        <View style={styles.scene}>
            <View style={styles.header}>
                <Image
                    source={{ uri: data.avatar_url }}
                    style={{ width: 100, height: 100 }}
                />
                <Text style={styles.textDefault}>Name: {data.name}</Text>
                <Text style={styles.textDefault}>@{data.username}</Text>
                <Text style={styles.textDefault}>
                    Pronouns: {data.pronouns}
                </Text>
                <Text style={styles.textDefault}>
                    Verified: {data.verified ? "Yes" : "No"}
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
                            <Text style={styles.textDefault}>dominante</Text>
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
                            <Text style={styles.textDefault}>average</Text>
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
                            <Text style={styles.textDefault}>vibrant</Text>
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
                            <Text style={styles.textDefault}>darkVibrant</Text>
                        </View>
                        <View
                            style={{
                                backgroundColor: colors.lightVibrant,
                                height: 50,
                                borderRadius: 8,
                                marginBottom: 10,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text style={styles.textDefault}>lightVibrant</Text>
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
                            <Text style={styles.textDefault}>darkMuted</Text>
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
                            <Text style={styles.textDefault}>lightMuted</Text>
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
                            <Text style={styles.textDefault}>muted</Text>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scene: {
        padding: 20,
        backgroundColor: "#161718",
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
});
