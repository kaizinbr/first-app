import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useLocalSearchParams } from "expo-router";
import TextDefault from "@/components/core/text-core";
import Button from "@/components/button";
import {
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    View
} from "react-native";
import OTPInput from "@/components/auth/otp-input";

import { Link } from "expo-router";

export default function VerifyToken() {
    const { email } = useLocalSearchParams();
    const [otp, setOtp] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (code: string) => {
        setIsLoading(true);
        setErrorMessage("");

        const { data, error } = await authClient.signIn.emailOtp({
            email: email as string,
            otp: code,
        });

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

        setIsLoading(false);
    };

    // Dispara o submit automaticamente assim que o código estiver completo
    useEffect(() => {
        if (otp.length === 6 && !isLoading) {
            handleSignUp(otp);
        }
    }, [otp]);

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
                        <Button
                            onPress={() => handleSignUp(otp)}
                            disabled={otp.length !== 6 || isLoading}
                            loading={isLoading}
                        >
                            Entrar
                        </Button>
                        <Link
                            href={{
                                pathname: "/(auth)/password/[email]",
                                params: { email: email as string },
                            }}
                            style={{ marginTop: 16 }}
                        >
                            <TextDefault>Prefiro usar minha senha</TextDefault>
                        </Link>
                    </View>
                </View>
            </ScrollView>
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
        alignItems: "center",
        width: "100%",
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        color: "#eeeeee",
    },
    error: {
        color: "#ff4d4d",
        fontSize: 14,
        marginTop: 8,
    },
});