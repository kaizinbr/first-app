import { useState } from "react";
import { authClient } from "@/lib/auth-client";

import Button from "@/components/button";
import Input from "@/components/input";
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    Platform,
} from "react-native";

import { Link } from "expo-router";

export default function Index() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async () => {
        const response = await authClient.signIn.email({
            email,
            password,
            callbackURL: "/",
        });

        console.log("Sign Up response:", response);
    };

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
                    <Text style={styles.title}>Olá, entre na sua conta</Text>
                    <View style={styles.container}>
                        <Input
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <Input
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <Button onPress={handleSignUp}>Entrar</Button>
                    </View>
                    <Link href="/sign-up" style={{ marginTop: 16 }}>
                        Não tem uma conta? Entre aqui
                    </Link>
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
        height: "100%",
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
