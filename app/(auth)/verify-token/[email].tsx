import { useState, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { useLocalSearchParams } from "expo-router";

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

    const router = useRouter();

    const handleSignUp = async () => {
        const { data, error } = await authClient.signIn.emailOtp({
            email: email as string,
            otp: otp,
                
        });

        console.log("Resposta da verificação do OTP:", { data, error });

        // if (data?.success) {
        //     router.push("/(app)/(tabs)/(home)");
        // } else {
        //     alert("Código de verificação inválido. Tente novamente.");
        // }
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
                    <Text style={styles.title}>
                        Confirme o código de verificação
                    </Text>
                    <View style={styles.container}>
                        <View style={{ marginBottom: 16 }}>
                            Enviamos um código de 6 dígitos para o seu e-mail:{" "}
                            {email as string}
                        </View>
                        <OTPInput length={6} onComplete={setOtp} />
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
});
