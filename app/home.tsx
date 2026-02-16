import Button from "@/components/button";
import Input from "@/components/input";
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Image,
    Platform,
} from "react-native";

export default function Index() {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.main}>
                    <Image
                        source={require("@/assets/images/img1.png")}
                        style={styles.image}
                    />
                    <Text style={styles.title}>Entrouuuuuuu</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
