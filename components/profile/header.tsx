import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { UserProfile } from "@/lib/types";
import { MaterialTabBar } from "react-native-collapsible-tab-view";

export default function ProfileHeader({ data }: { data: UserProfile }) {
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
