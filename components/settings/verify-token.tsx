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
    Pressable,
} from "react-native";
import OTPInput from "@/components/auth/otp-input";

import { Link, useRouter } from "expo-router";

interface OTPInputProps {
    length?: number;
    onComplete: (code: string) => void;
}

export default function VerifyToken({
    userData,
    setStep,
}: {
    userData: any;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleVerifyOtp = async () => {
        setIsLoading(true);
        setErrorMessage("");
        const { data, error } = await authClient.emailOtp.checkVerificationOtp({
            email: userData.email,
            type: "forget-password",
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

        // Se chegou aqui, o OTP é válido
        setErrorMessage("");
        setIsLoading(false);
        setStep(2); // Avança para a próxima etapa, onde o usuário pode definir a nova senha
    };

    return (
        <View style={styles.container}>
                <TextDefault>
                    Enviamos um código de 6 dígitos para o seu e-mail
                </TextDefault>
            <OTPInput length={6} onComplete={setOtp} />
            {errorMessage ? (
                <TextDefault style={styles.error}>{errorMessage}</TextDefault>
            ) : null}
            <Button onPress={handleVerifyOtp}>Confirmar</Button>

            <Pressable onPress={() => setStep(0)}>
                <TextDefault style={{ color: "#8065ef" }}>
                    Voltar para o início
                </TextDefault>
            </Pressable>
        </View>
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
        gap: 16,
        alignItems: "center",
        width: "100%",   
        backgroundColor: "#1b1c1d",
        padding: 16,
        borderRadius: 12,
        overflow: "hidden",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
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
