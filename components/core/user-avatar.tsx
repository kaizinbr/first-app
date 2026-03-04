import { Pressable, Text, View, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
// import {Image} from "expo-image";

export default function Avatar({
    data,
    size,
}: {
    data: {
        id: string;
        username: string;
        name: string;
        avatar_url: string;
    };
    size: number;
}) {
    const router = useRouter();

    const handlePress = () => {
        router.navigate(`/user/${data.username}`);
    };

    // console.log("User card data:", data);
    return (
        <Pressable
            style={({ pressed }) => [
                styles.btnMain,
                pressed && styles.pressedBtnMain,
            ]}
            onPress={handlePress}
        >
            <Image source={{ uri: data.avatar_url }} style={[styles.avatar, { width: size, height: size, borderRadius: size * 0.306 }]} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    btnMain: {
        backgroundColor: "transparent",
        // width: "100%",
        // paddingVertical: 8,
        // paddingHorizontal: 16,
        // flexDirection: "row",
        alignItems: "center",
        // gap: 10,
    },
    pressedBtnMain: {
        backgroundColor: "#1e1e1e",
        width: "100%",
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    btnText: {
        fontWeight: "bold",
        color: "#eee",
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
        width: 32,
        height: 32,
        backgroundColor: "#bbb",
        borderRadius: 32 * 0.306,
        marginBottom: 8,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#ccc",
    },
});
