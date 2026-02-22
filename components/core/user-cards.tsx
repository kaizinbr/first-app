import { Pressable, Text, View, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
// import {Image} from "expo-image";

export default function UserCards({
    data,
}: {
    data: {
        id: string;
        username: string;
        name: string;
        avatar_url: string;
    };
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
            <Image source={{ uri: data.avatar_url }} style={styles.avatar} />
            <View style={styles.btnTextWrapper}>
                <Text style={styles.btnText}>{data.name}</Text>
                <Text style={styles.btnSubtext}>@{data.username}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    btnMain: {
        backgroundColor: "transparent",
        width: "100%",
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
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
        width: 40,
        height: 40,
        borderRadius: 9999,
        backgroundColor: "#ccc",
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#ccc",
    },
});
