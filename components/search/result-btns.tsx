import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter, Href } from "expo-router";

export function ResultUserBtn({
    name,
    username,
}: {
    name: string;
    username: string;
}) {
    const router = useRouter();

    const handlePress = () => {
        router.navigate(`/user/${username}`);
    };
    return (
        <Pressable
            style={({ pressed }) => [
                styles.btnMain,
                pressed && styles.pressedBtnMain,
            ]}
            onPress={handlePress}
        >
            <View style={styles.avatar}></View>
            <View style={styles.btnTextWrapper}>
                <Text style={styles.btnText}>{name}</Text>
                <Text style={styles.btnSubtext}>@{username}</Text>
            </View>
        </Pressable>
    );
}

export function ResultArtistBtn({ name, id }: { name: string, id: string }) {
    const router = useRouter();

    const handlePress = () => {
        router.navigate(`/artist/${id}`);
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.btnMain,
                pressed && styles.pressedBtnMain,
            ]}
            onPress={handlePress}
        >
            <View style={styles.avatar}></View>
            <View style={styles.btnTextWrapper}>
                <Text style={styles.btnText}>{name}</Text>
            </View>
        </Pressable>
    );
}

export function ResultAlbumBtn({
    id,
    name,
    artists,
}: {
    id: string;
    name: string;
    artists: string[];
}) {
    const router = useRouter();

    const handlePress = () => {
        router.navigate(`/album/${id}`);
    };
    return (
        <Pressable
            style={({ pressed }) => [
                styles.btnMain,
                pressed && styles.pressedBtnMain,
            ]}
            onPress={handlePress}
        >
            <View style={styles.image}></View>
            <View style={styles.btnTextWrapper}>
                <Text style={styles.btnText}>{name}</Text>
                <Text style={styles.btnSubtext}>{artists.join(", ")}</Text>
            </View>
        </Pressable>
    );
}

export function ResultTrackBtn({
    id,
    name,
    artists,
}: {
    id: string;
    name: string;
    artists: string[];
}) {
    const router = useRouter();

    const handlePress = () => {
        router.navigate(`/album/${id}`);
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.btnMain,
                pressed && styles.pressedBtnMain,
            ]}
            onPress={handlePress}
        >
            <View style={styles.image}></View>
            <View style={styles.btnTextWrapper}>
                <Text style={styles.btnText}>{name}</Text>
                <Text style={styles.btnSubtext}>{artists.join(", ")}</Text>
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
        backgroundColor: "#f0f0f0",
        width: "100%",
        padding: 8,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    btnText: {
        fontWeight: "bold",
    },
    btnSubtext: {
        color: "#6d6d6d",
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
