import { Text, Image, View, StyleSheet } from "react-native";
import Button from "@/components/button";
import { authClient } from "@/lib/auth-client";

export default function Index() {
    const { data: session } = authClient.useSession();

    const handleLogoff = async () => {
        await authClient.signOut();
    };

    return (
        <>
            <View style={styles.main}>
                                <Image
                                    source={require("@/assets/images/img1.png")}
                                    style={styles.image}
                                />
                                <Text style={styles.title}>Entrouuuuuuu</Text>
                            </View>
        </>
    );
}




const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: "#fff",
        alignItems: "center",
        width: "100%",
        marginTop: 20,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
    },
    image: {
        width: "100%",
        height: 300,
        marginTop: 20,
        resizeMode: "contain",
    },
});
