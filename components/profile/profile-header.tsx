import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { UserProfile } from "@/lib/types";

import { getColors } from "react-native-image-colors";
import { useState, useEffect } from "react";
import { Palette } from "@/lib/types";
import Avatar from "@/components/core/user-avatar";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { darkenColor,getHeaderColor } from "@/lib/util/workWithColors";

export default function ProfileHeader({ data }: { data: UserProfile }) {
    const [colors, setColors] = useState<Palette | any>({
        dominant: "#8065ef",
        vibrant: "#8065ef",
        darkVibrant: "#8065ef",
        muted: "#8065ef",
    });

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const result = await getColors(data.avatar_url, {
                    fallback: "#000",
                    cache: true,
                    key: data.avatar_url,
                    quality: "low",
                });

                console.log("Colors fetched successfully:", result);
                setColors(result);
            } catch (error) {
                console.error("Error fetching colors:", error);
            }
        };
        fetchColors();
    }, []);

    return (
        <View style={styles.scene}>
            <View
                style={{
                    ...styles.header,
                    backgroundColor:
                        getHeaderColor(colors) || "#161718",
                }}
            >
                <View style={styles.wrapper}>
                    <Image
                        source={{ uri: data.avatar_url }}
                        style={[
                            styles.avatar,
                            {
                                width: 112,
                                height: 112,
                                borderRadius: 112 * 0.306,
                            },
                        ]}
                    />
                    {data.pronouns && (
                        <View style={styles.pronouns}>
                            <Text style={styles.pronounstext}>
                                {data.pronouns}
                            </Text>
                        </View>
                    )}
                </View>
                <Text style={styles.name}>{data.name}</Text>
                <Text style={styles.username}>@{data.username}</Text>
                <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
                    <Text style={styles.textDefault}>0 reviews</Text>
                    <Text style={styles.textDefault}>0 seguindo</Text>
                    <Text style={styles.textDefault}>0 seguidores</Text>
                </View>
                <Pressable style={styles.followBtn}>
                    <Text style={{ color: "#eee", fontWeight: "bold" }}>
                        Seguir
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scene: {
        // backgroundColor: "red",
    },

    header: {
        padding: 16,
        paddingTop: 84,
        paddingBottom: 32,
        width: "100%",
        color: "#eee",
        borderRadius: 0,
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
        fontSize: 14,
    },
    name: {
        fontWeight: "bold",
        color: "#eee",
        fontSize: 18,
    },
    username: {
        color: "#b9b9b9",
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
    followBtn: {
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 9999,
        backgroundColor: "#8065ef",
    },
});
