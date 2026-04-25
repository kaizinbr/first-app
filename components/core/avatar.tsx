import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { EnrichedMarkdownText } from "react-native-enriched-markdown";
import { truncateMarkdown } from "@/lib/util/truncate";

import { authClient } from "@/lib/auth-client";
import { useRouter, Href, Link } from "expo-router";
import api from "@/lib/api";
import { Image } from "expo-image";
import { UserProfile } from "@/lib/types";

export default function Avatar({
    data,
    style,
    size,
}: {
    data: UserProfile;
    style?: any;
    size?: number;
}) {
    const router = useRouter();

    return (
        <Pressable
            onPress={() =>
                router.push({
                    pathname: "/user/[username]",
                    params: { username: data.lowername },
                })
            }
            style={({ pressed }) => [
                styles.main,
                pressed && styles.mainPressed,
            ]}
        >
            <Image
                source={{ uri: data.avatar_url! }}
                style={[
                    styles.cardImage,
                    style,
                    {
                        width: size,
                        height: size,
                        borderRadius: (size || 32) * 0.306,
                    },
                ]}
            />
        </Pressable>
    );
}

export function AvatarNoPress({
    data,
    style,
    size,
}: {
    data: UserProfile | any;
    style?: any;
    size?: number;
}) {
    return (
        <Image
            source={{ uri: data.avatar_url! }}
            style={[
                styles.cardImage,
                style,
                {
                    width: size,
                    height: size,
                    borderRadius: (size || 32) * 0.306,
                },
            ]}
        />
    );
}

const styles = StyleSheet.create({
    main: {
        width: "100%",
        backgroundColor: "transparent",
        borderRadius: 8,
    },
    mainPressed: {
        backgroundColor: "#1e1e1e",
    },
    cardImage: {
        width: 32,
        height: 32,
        backgroundColor: "#bbb",
        borderRadius: 32 * 0.306,
    },
});
