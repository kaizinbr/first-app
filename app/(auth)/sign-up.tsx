import Button from "@/components/button";
import TextDefault from "@/components/core/text-core";
import Input from "@/components/input";
import { authClient } from "@/lib/auth-client";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";

import { PasswordInput } from "@/components/core/input-password";
import {
    Unread
} from "@/lib/solar-icons/Outline";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Link, useRouter } from "expo-router";

interface OTPInputProps {
    length?: number;
    onComplete: (code: string) => void;
}

export default function Password() {
    const insets = useSafeAreaInsets();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const [message, setMessage] = useState("");

    const [isCharOk, setIsCharOk] = useState(false);
    const [isLengthOk, setIsLengthOk] = useState(false);
    const [isSpecialCharOk, setIsSpecialCharOk] = useState(false);
    const [isEqual, setIsEqual] = useState(false);

    const handleCheckPassword = (password: string) => {
        setIsLengthOk(password.length >= 8 && password.length <= 32);
        setIsCharOk(/[a-z]/.test(password) && /[A-Z]/.test(password));
        setIsSpecialCharOk(/[0-9!@#$%^&*(),.?":{}|<>]/.test(password));
    };

    function handleChangePassword(value: string) {
        setPassword(value);
        handleCheckPassword(value);
    }

    function handleConfirmPassword(value: string) {
        setConfirmPassword(value);
    }

    useEffect(() => {
        if (password === confirmPassword && password.length > 0) {
            setIsEqual(true);
        } else {
            setIsEqual(false);
        }
    }, [password, confirmPassword]);

    const handleResetPassword = async () => {
        // if (!userData?.email) {
        //     console.error("User email not found");
        //     setMessage(
        //         "Email do usuário não encontrado. Verifique seu perfil.",
        //     );
        //     return;
        // }

        if (password.length === 0 || confirmPassword.length === 0) {
            setMessage(
                "Por favor, preencha todos os campos de senha para redefinir.",
            );
            return;
        }

        // const { data, error } = await authClient.changePassword({
        //     newPassword,
        //     password,
        // });

        // if (error) {
        //     console.error("Error requesting password reset:", error);
        //     setMessage(
        //         "Erro ao solicitar redefinição de senha. Verifique sua senha atual e tente novamente.",
        //     );
        //     return;
        // }

        // console.log("Password reset requested successfully:", data);

        // setStep(1);

        // console.log("Reset password clicked");
    };

    const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const handleSignIn = async () => {
        setIsLoading(true);
        setErrorMessage("");

        const { data, error } = await authClient.signUp.email({
            email: email as string,
            password,
            name,
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
        } else if (error?.status === 422) {
            setErrorMessage(
                "O e-mail fornecido já está em uso. Por favor, use um e-mail diferente ou faça login.",
            );
            setIsLoading(false);
            return;
        } else if (error) {
            setErrorMessage("Ocorreu um erro. Por favor, tente novamente.");
            setIsLoading(false);
            return;
        }

        router.push("/(app)/(tabs)/(ahome)");
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <LinearGradient
                colors={["#161718", "transparent"]}
                style={[
                    StyleSheet.absoluteFill,
                    {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "transparent",
                        zIndex: 10,
                        height: insets.top + 24,
                    },
                ]}
            />
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingTop: 50 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.main}>
                    <View style={styles.container}>
                        <TextDefault style={styles.title}>
                            Criar conta
                        </TextDefault>
                        <View style={{ marginBottom: 16 }}>
                            <TextDefault>
                                Informe seu e-mail e senha para criar uma conta
                            </TextDefault>
                        </View>
                        <Input
                            placeholder="Nome"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            autoComplete="name"
                        />

                        <Input
                            placeholder="E-mail"
                            value={email as string}
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
                            onChangeText={handleChangePassword}
                            login={true}
                        />
                        <PasswordInput
                            placeholder="Confirmar Senha"
                            value={confirmPassword}
                            onChangeText={handleConfirmPassword}
                            login={true}
                        />
                        <View style={{ paddingHorizontal: 16, width: "100%" }}>
                            <TextDefault style={[{ marginBottom: 8 }]}>
                                Parâmetros de senha:
                            </TextDefault>

                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 4,
                                    marginBottom: 4,
                                }}
                            >
                                <Unread
                                    size={20}
                                    color={isLengthOk ? "#4caf50" : "#eee"}
                                />
                                <TextDefault
                                    style={[
                                        styles.textDefault,
                                        { fontSize: 14 },
                                        {
                                            color: isLengthOk
                                                ? "#4caf50"
                                                : "#eee",
                                        },
                                    ]}
                                >
                                    Entre 8 e 32 caracteres
                                </TextDefault>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 4,
                                    marginBottom: 4,
                                }}
                            >
                                <Unread
                                    size={20}
                                    color={isCharOk ? "#4caf50" : "#eee"}
                                />
                                <TextDefault
                                    style={[
                                        styles.textDefault,
                                        { fontSize: 14 },
                                        {
                                            color: isCharOk
                                                ? "#4caf50"
                                                : "#eee",
                                        },
                                    ]}
                                >
                                    Letras maiúsculas e minúsculas
                                </TextDefault>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 4,
                                    marginBottom: 4,
                                }}
                            >
                                <Unread
                                    size={20}
                                    color={isSpecialCharOk ? "#4caf50" : "#eee"}
                                />
                                <TextDefault
                                    style={[
                                        styles.textDefault,
                                        { fontSize: 14 },
                                        {
                                            color: isSpecialCharOk
                                                ? "#4caf50"
                                                : "#eee",
                                        },
                                    ]}
                                >
                                    Pelo menos um número ou caractere especial
                                </TextDefault>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 4,
                                    marginBottom: 16,
                                }}
                            >
                                <Unread
                                    size={20}
                                    color={isEqual ? "#4caf50" : "#eee"}
                                />
                                <TextDefault
                                    style={[
                                        styles.textDefault,
                                        { fontSize: 14 },
                                        { color: isEqual ? "#4caf50" : "#eee" },
                                    ]}
                                >
                                    As senhas devem ser iguais
                                </TextDefault>
                            </View>

                            {message ? (
                                <TextDefault
                                    style={[
                                        styles.textDefault,
                                        { color: "#ff6b6b", marginBottom: 16 },
                                    ]}
                                >
                                    {message}
                                </TextDefault>
                            ) : null}
                        </View>
                        {errorMessage ? (
                            <TextDefault style={styles.error}>
                                {errorMessage}
                            </TextDefault>
                        ) : null}
                        <Button onPress={handleSignIn}>Criar</Button>
                    </View>
                    <Link href="/sign-in" style={{ marginTop: 16 }}>
                        <TextDefault>Já tem uma conta? Entre aqui</TextDefault>
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
        backgroundColor: "#212223222",
        borderRadius: 12,
        color: "#eeeeee",
        fontFamily: "Walsheim",
        fontWeight: 400,
    },
    textDefault: {
        color: "#eee",
    },
});
