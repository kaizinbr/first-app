import { useState, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { useLocalSearchParams } from "expo-router";
import TextDefault from "@/components/core/text-core";
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
import OTPInput from "@/components/auth/otp-input";

import { Link, useRouter } from "expo-router";

interface OTPInputProps {
    length?: number;
    onComplete: (code: string) => void;
}

export default function VerifyToken() {
    const { email } = useLocalSearchParams();
    console.log("Email recebido nos params:", email);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSignUp = async () => {
        setIsLoading(true);
        setErrorMessage("");
        const { data, error } = await authClient.signIn.emailOtp({
            email: email as string,
            otp: otp,
        });

        console.log("Resposta da verificação do OTP:", { data, error });
        if (error?.status === 403) {
            setErrorMessage(
                "Limite de tentativas excedido. Por favor, solicite um novo código.",
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
                "Código de verificação inválido. Por favor, tente novamente.",
            );
            setIsLoading(false);
            return;
        }
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
                            Confirme o código de verificação
                        </TextDefault>
                        <View style={{ marginBottom: 16 }}>
                            <TextDefault>
                                Enviamos um código de 6 dígitos para o seu
                                e-mail: {email as string}
                            </TextDefault>
                        </View>
                        <OTPInput length={6} onComplete={setOtp} />
                        {errorMessage ? (
                            <TextDefault style={styles.error}>
                                {errorMessage}
                            </TextDefault>
                        ) : null}
                        <Button onPress={handleSignUp}>Entrar</Button>
                    </View>
                    {/* <Link href="/sign-up" style={{ marginTop: 16 }}>
                        <TextDefault>Não tem uma conta? Entre aqui</TextDefault>
                    </Link> */}
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
});
