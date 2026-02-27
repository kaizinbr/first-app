import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter, Href } from "expo-router";
import {
    SearchResponse,
    Track,
    Album,
    Artist,
    UserProfile,
    Review,
} from "@/lib/types";

import { Image } from "expo-image";

export function ResultUserBtn({ data }: { data: UserProfile }) {
    const router = useRouter();
    const handlePress = () => {
        router.navigate(`/user/${data.username}`);
    };
    return (
        <Pressable
            style={({ pressed }) => [
                styles.btnMain,
                pressed && styles.pressedBtnMain,
            ]}
            onPress={handlePress}
        >
            <Image source={{ uri: data.avatar_url }} style={styles.avatar} />
            <View style={styles.btnTextWrapper}>
                <Text style={styles.btnText}>{data.name}</Text>
                <Text style={styles.btnSubtext}>@{data.username}</Text>
            </View>
        </Pressable>
    );
}

export function ResultArtistBtn({ data }: { data: Artist }) {
    const router = useRouter();

    const handlePress = () => {
        router.navigate(`/artist/${data.id}`);
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.btnMain,
                pressed && styles.pressedBtnMain,
            ]}
            onPress={handlePress}
        >
            <Image
                source={{
                    uri: data.images![2]?.url || `https://api.dicebear.com/8.x/initials/png?seed=${data.id}`,
                }}
                style={styles.avatar}
            />
            <View style={styles.btnTextWrapper}>
                <Text style={styles.btnText}>{data.name}</Text>
            </View>
        </Pressable>
    );
}

export function ResultAlbumBtn({
    data
}: {
    data: Album;
}) {
    const router = useRouter();

    const handlePress = () => {
        router.navigate(`/album/${data.id}`);
    };
    return (
        <Pressable
            style={({ pressed }) => [
                styles.btnMain,
                pressed && styles.pressedBtnMain,
            ]}
            onPress={handlePress}
        >
            <Image
                source={{
                    uri: data.images![2]?.url || `https://api.dicebear.com/8.x/initials/png?seed=${data.id}`,
                }}
                style={styles.image}
            />
            <View style={styles.btnTextWrapper}>
                <Text style={styles.btnText}>{data.name}</Text>
                <Text style={styles.btnSubtext}>{data.artists.map((a) => a.name).join(", ")}</Text>
            </View>
        </Pressable>
    );
}

export function ResultTrackBtn({
    data
}: {
    data: Track;
}) {
    const router = useRouter();

    const handlePress = () => {
        router.navigate(`/album/${data.album.id}`);
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.btnMain,
                pressed && styles.pressedBtnMain,
            ]}
            onPress={handlePress}
        >
            <Image
                source={{
                    uri: data.album.images![2]?.url || `https://api.dicebear.com/8.x/initials/png?seed=${data.album.id}`,
                }}
                style={styles.image}
            />
            <View style={styles.btnTextWrapper}>
                <Text style={styles.btnText}>{data.name}</Text>
                <Text style={styles.btnSubtext}>{data.artists.map((a) => a.name).join(", ")}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    btnMain: {
        backgroundColor: "transparent",
        width: "100%",
        padding: 8,
        borderRadius: 16,

        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    pressedBtnMain: {
        backgroundColor: "#3a3a3a",
        width: "100%",
        padding: 8,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    btnText: {
        fontWeight: "bold",
        color: "#eeeeee",
    },
    btnSubtext: {
        color: "#9d9d9d",
        fontSize: 12,
        fontWeight: "bold",
    },
    btnTextWrapper: {
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ccc",
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#ccc",
    },
});
