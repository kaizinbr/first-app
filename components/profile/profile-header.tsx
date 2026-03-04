import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { UserProfile } from "@/lib/types";

import { getColors } from "react-native-image-colors";
import { useState, useEffect } from "react";
import { Palette } from "@/lib/types";
import Avatar from "@/components/core/user-avatar";

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
                <View style={styles.wrapper}>
                    <Image
                        source={{ uri: data.avatar_url }}
                        style={[
                            styles.avatar,
                            { width: 112, height: 112, borderRadius: 112 * 0.306 },
                        ]}
                    />
                    <View style={styles.pronouns}>
                        <Text style={styles.pronounstext}>{data.pronouns}</Text>
                    </View>
                </View>
                <Text style={styles.name}>{data.name}</Text>
                <Text style={styles.username}>@{data.username}</Text>
                {/* <Text style={styles.textDefault}>
                    Pronouns: {data.pronouns}
                </Text>
                <Text style={styles.textDefault}>
                    Verified: {data.verified ? "Yes" : "No"}
                </Text> */}
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
        paddingTop: 48,
        width: "100%",
        color: "#eee",
        borderRadius: 8,
        alignItems: "center",
    },
    wrapper: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexDirection: "column",
        marginBottom: 28,
    },
    textDefault: {
        color: "#eee", // A cor clara para o seu modo escuro
        fontSize: 16,
    },
    name: {
        fontWeight: "bold",
        color: "#eee",
        fontSize: 18,
    },
    username: {
        color: "#929292",
        fontSize: 14,
    },
    pronouns: {
        color: "#929292",
        fontSize: 12,
        marginTop: 4,
        position: "absolute",
        bottom: -20,
        zIndex: 10,
        backgroundColor: "#8065ef",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    pronounstext: {
        color: "#eee",
        fontSize: 12,
        fontWeight: "bold",
    },
    avatar: {
        backgroundColor: "#bbb",
    },
});
