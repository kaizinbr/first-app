import { useState, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { useLocalSearchParams } from "expo-router";
import TextDefault from "@/components/core/text-core";
import Button from "@/components/button";
import Input from "@/components/input";

import { PasswordInput } from "@/components/core/input-password";
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
import OTPInput from "@/components/auth/otp-input";

import { Link, useRouter } from "expo-router";

interface OTPInputProps {
    length?: number;
    onComplete: (code: string) => void;
}

export default function Password() {
    const { email } = useLocalSearchParams();
    // console.log("Email recebido nos params:", email);
    const [emailValue, setEmail] = useState(email || "");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const handleSignIn = async () => {
        setIsLoading(true);
        setErrorMessage("");

        const { data, error } = await authClient.signIn.email({
            email: email as string,
            password,
            
        });

        console.log("Resposta", { data, error });
        if (error?.status === 401) {
            setErrorMessage(
                "E-mail ou senha incorretos, verifique as informações e tente novamente.",
            );
            setIsLoading(false);
            return;
        } else if (error?.status === 429) {
            setErrorMessage(
                "Muitas tentativas. Por favor, aguarde um momento antes de tentar novamente.",
            );
            setIsLoading(false);
            return;
        } else if (error) {
            setErrorMessage(
                "Ocorreu um erro. Por favor, tente novamente.",
            );
            setIsLoading(false);
            return;
        }

        router.push("/(app)/(tabs)/(home)")
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
                    <View style={styles.container}>
                        <TextDefault style={styles.title}>
                            Usar senha
                        </TextDefault>
                        <View style={{ marginBottom: 16 }}>
                            <TextDefault>
                                Enviamos um código de 6 dígitos para o seu
                                e-mail: {emailValue as string}
                            </TextDefault>
                        </View>

                        <Input
                            placeholder="Email"
                            value={emailValue as string}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            inputMode="email"
                            // error={errorMessage ? true : false}
                        />

                        <PasswordInput
                            placeholder="Senha"
                            value={password}
                            onChangeText={setPassword}
                            login={true}
                        />
                        {errorMessage ? (
                            <TextDefault style={styles.error}>
                                {errorMessage}
                            </TextDefault>
                        ) : null}
                        <Button onPress={handleSignIn}>Entrar</Button>
                    </View>
                    <Link href="/sign-up" style={{ marginTop: 16 }}>
                        <TextDefault>Não tem uma conta? Entre aqui</TextDefault>
                    </Link>
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
        flex: 1,
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
        color: "#ff4d4d",
        fontSize: 14,
        marginTop: 8,
    },
    
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#262626",
        backgroundColor: "#1b1c1d222",
        borderRadius: 12,
        color: "#eeeeee",
        fontFamily: "Walsheim",
        fontWeight: 400,
    },
});
