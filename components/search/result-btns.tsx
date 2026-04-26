import { AvatarNoPress } from "@/components/core/avatar";
import {
    Album,
    Artist,
    Track,
    UserProfile
} from "@/lib/types";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import TextDefault from "@/components/core/text-core";
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
            <AvatarNoPress data={data} size={40} />
            <View style={styles.btnTextWrapper}>
                <TextDefault style={styles.btnText} numberOfLines={1}>{data.name}</TextDefault>
                <TextDefault style={styles.btnSubtext}>@{data.username}</TextDefault>
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
                    uri:
                        data.images![2]?.url ||
                        `https://api.dicebear.com/8.x/initials/png?seed=${data.id}`,
                }}
                style={styles.avatar}
            />
            <View style={styles.btnTextWrapper}>
                <TextDefault style={styles.btnText} numberOfLines={2}>{data.name}</TextDefault>
            </View>
        </Pressable>
    );
}

export function ResultAlbumBtn({ data }: { data: Album }) {
    const router = useRouter();
    // console.log("Renderizando ResultAlbumBtn para:", data.name);

    const handlePress = () => {
        router.push({
            pathname: `/album/[id]`,
            params: { id: data.id },
        });
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
                    uri:
                        data.images![2]?.url ||
                        `https://api.dicebear.com/8.x/initials/png?seed=${data.id}`,
                }}
                style={styles.image}
            />
            <View style={styles.btnTextWrapper}>
                <TextDefault style={styles.btnText} numberOfLines={1}>
                    {data.name}
                </TextDefault>
                <TextDefault style={styles.btnSubtext} numberOfLines={1}>
                    {data.artists.map((a) => a.name).join(", ")}
                </TextDefault>
            </View>
        </Pressable>
    );
}

export function ResultTrackBtn({ data }: { data: Track }) {
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
                    uri:
                        data.album.images![2]?.url ||
                        `https://api.dicebear.com/8.x/initials/png?seed=${data.album.id}`,
                }}
                style={styles.image}
            />
            <View style={styles.btnTextWrapper}>
                <TextDefault style={styles.btnText} numberOfLines={1}>
                    {data.name}
                </TextDefault>
                <TextDefault style={styles.btnSubtext} numberOfLines={1}>
                    {data.artists.map((a) => a.name).join(", ")}
                </TextDefault>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    btnMain: {
        backgroundColor: "transparent",
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,

        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    pressedBtnMain: {
        backgroundColor: "#1b1c1d",
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
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
        borderRadius: 4,
        backgroundColor: "#ccc",
    },
});
