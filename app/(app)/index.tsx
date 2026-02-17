import { Text, Image, View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import Feed from "@/components/home/feed";

export default function Index() {
    const { data: session } = authClient.useSession();

    const handleLogoff = async () => {
        await authClient.signOut();
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.main}>
                    <Text style={styles.title}>
                        Olá, {session?.user?.name || "usuário"}!
                    </Text>
                    <ScrollView
                        // contentContainerStyle={{ maxHeight: 120 }}
                        keyboardShouldPersistTaps="handled"
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                    >
                        <View style={styles.banner}>
                            <View style={styles.bannerCard}></View>
                            <View style={styles.bannerCard}></View>
                            <View style={styles.bannerCard}></View>
                            <View style={styles.bannerCard}></View>
                        </View>
                    </ScrollView>
                    <Feed />
                    {/* <Image
                        source={require("@/assets/images/img1.png")}
                        style={styles.image}
                    /> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: "#fff",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 16,
    },
    main: {
        flex: 1,
        backgroundColor: "#fff",
        width: "100%",
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        textAlign: "left",
        marginTop: 32,
    },
    h2: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "left",
        marginTop: 32,
    },
    feed: {
        gap: 8,
        marginTop: 20,
    },
    feedCard: {
        height: 120,
        width: "100%",
        backgroundColor: "#eee",
        borderRadius: 8,
    },
    image: {
        width: "100%",
        height: 300,
        marginTop: 20,
        resizeMode: "contain",
    },
    banner: {
        flexDirection: "row",
        gap: 8,
        marginTop: 20,
        height: 120,
    },
    bannerCard: {
        height: 120,
        width: 120,
        backgroundColor: "#eee",
        borderRadius: 8,
    },
});
