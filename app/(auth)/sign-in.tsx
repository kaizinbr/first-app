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
    ActivityIndicator,
} from "react-native";
import TextDefault from "@/components/core/text-core";

import { Link, useRouter } from "expo-router";

export default function Index() {
    const [email, setEmail] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const router = useRouter();

    const handleSignUp = async () => {
        setErrorMessage("");
        setIsLoading(true);
        if (!emailRegex.test(email)) {
            setErrorMessage("Por favor, insira um e-mail válido.");
            setIsLoading(false);
            return;
        }

        const response = await authClient.emailOtp.sendVerificationOtp({
            email,
            type: "sign-in",
        });

        console.log("Sign Up response:", response);

        if (response.data!.success) {
            router.push({
                pathname: "/(auth)/verify-token/[email]",
                params: { email },
            });
        } else {
            setErrorMessage(
                "Ocorreu um erro ao enviar o código. Tente novamente.",
            );
        }
        setIsLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setErrorMessage("");
        setIsLoading(true);
        try {
            const { error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });

            if (error) {
                setErrorMessage(
                    "Ocorreu um erro ao iniciar sessão com Google.",
                );
                console.error(error);
                setIsLoading(false);
                return;
            }
            // Não precisa de router.replace aqui — o expoClient redireciona automaticamente
            // via deep link após o login
        } catch (error) {
            console.error("Erro ao iniciar sessão com Google:", error);
            setErrorMessage("Ocorreu um erro ao iniciar sessão com Google.");
        }
        setIsLoading(false);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingTop: 50 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.main}>
                    <TextDefault style={styles.title}>
                        Olá, insira seu e-mail
                    </TextDefault>
                    <View style={styles.container}>
                        <Input
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            inputMode="email"
                            error={errorMessage ? true : false}
                        />
                        {errorMessage ? (
                            <TextDefault style={styles.error}>
                                {errorMessage}
                            </TextDefault>
                        ) : null}
                        <Button onPress={handleSignUp} disabled={isLoading}>
                            Continuar
                        </Button>
                    </View>
                    {/* <Link href="/sign-up" style={{ marginTop: 16 }}>
                        Não tem uma conta? Entre aqui
                    </Link> */}

                    <View style={styles.container}>
                        <Button
                            onPress={handleGoogleSignIn}
                            disabled={isLoading}
                            style={{
                                backgroundColor: "transparent",
                                borderWidth: 1,
                                borderColor: "#8065ef",
                            }}
                        >
                            Login com Google
                        </Button>
                    </View>
                </View>
            </ScrollView>

            {isLoading && (
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            zIndex: 999,
                        },
                    ]}
                >
                    <ActivityIndicator size="large" color="#8065ef" />
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "#eeeeee",
    },
    container: {
        // flex: 1,
        gap: 16,
        // backgroundColor: "#161718",
        alignItems: "center",
        width: "100%",
        marginTop: 20,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        color: "#eeeeee",
    },
    image: {
        width: "100%",
        height: 300,
        marginTop: 20,
        resizeMode: "contain",
    },
    error: {
        color: "#ff4d4f",
        marginTop: -8,
        marginBottom: 8,
    },
});
