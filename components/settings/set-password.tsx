import { useState, useEffect, use } from "react";
import {
    View,
    StyleSheet,
    RefreshControl,
    Text,
    Pressable,
} from "react-native";
import { Tabs, MaterialTabBar } from "react-native-collapsible-tab-view";
import { UserProfile, Palette } from "@/lib/types";
import {
    User,
    LockPassword,
    Letter,
    QuestionSquare,
    Logout2,
} from "@solar-icons/react-native/Bold";
import {
    AltArrowRight,
    AltArrowLeft,
    Unread,
    CloseSquare,
} from "@solar-icons/react-native/Outline";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AvatarNoPress } from "@/components/core/avatar";
import { useRouter } from "expo-router";

import { apiAuthPost } from "@/lib/api";

import TextDefault from "@/components/core/text-core";
import { PasswordInput } from "@/components/core/input-password";

import { authClient } from "@/lib/auth-client";
import VerifyToken from "@/components/settings/verify-token";

export default function Password({
    data,
    userData,
    accountData,
}: {
    data: UserProfile;
    userData: any;
    accountData: any;
}) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const FIXED_BAR_HEIGHT = insets.top + 50;

    const hasPassword = Array.isArray(accountData)
        ? accountData.some(
              (account: any) =>
                  account.providerId === "credential" && !!account.password,
          )
        : accountData?.providerId === "credential" && !!accountData?.password;
    const [step, setStep] = useState(0);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");

    const [isCharOk, setIsCharOk] = useState(false);
    const [isLengthOk, setIsLengthOk] = useState(false);
    const [isSpecialCharOk, setIsSpecialCharOk] = useState(false);
    const [isEqual, setIsEqual] = useState(false);

    console.log(
        accountData.some(
            (account: any) =>
                account.providerId === "credential" && !!account.password,
        ),
    );

    const handleCheckPassword = (password: string) => {
        setIsLengthOk(password.length >= 8 && password.length <= 32);
        setIsCharOk(/[a-z]/.test(password) && /[A-Z]/.test(password));
        setIsSpecialCharOk(/[0-9!@#$%^&*(),.?":{}|<>]/.test(password));
    };

    function handleCurrentPassword(value: string) {
        setCurrentPassword(value);
    }

    function handleChangePassword(value: string) {
        setNewPassword(value);
        handleCheckPassword(value);
    }

    function handleConfirmPassword(value: string) {
        setConfirmPassword(value);
    }

    useEffect(() => {
        if (newPassword === confirmPassword && newPassword.length > 0) {
            setIsEqual(true);
        } else {
            setIsEqual(false);
        }
    }, [newPassword, confirmPassword]);

    async function handleSetPassword() {
        if (newPassword !== confirmPassword) {
            console.error("As senhas não coincidem");
            setMessage("As senhas não coincidem");
            return;
        }

        try {
            const setPasswordResponse = await apiAuthPost(
                "/me/account/set-password",
                {
                    // current_password: currentPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                },
            );

            console.log("Password change response:", setPasswordResponse);

            if (setPasswordResponse.error) {
                console.error(
                    "Error changing password:",
                    setPasswordResponse.error,
                );
                setMessage(
                    "Ocorreu um erro ao alterar a senha. Tente novamente.",
                );
                return;
            }

            setMessage("Senha alterada com sucesso!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            router.back();
        } catch (error) {
            console.error("Error changing password:", error);
            setMessage("Ocorreu um erro ao alterar a senha. Tente novamente.");
        }
    }

    const handleResetPassword = async () => {


        const { data, error } = await authClient.emailOtp.requestPasswordReset({
            email: userData.email,
        });

        if (error) {
            console.error("Error requesting password reset:", error);
            setMessage("Erro ao solicitar redefinição de senha. Verifique sua senha atual e tente novamente.");
            return;
        }

        console.log("Password reset requested successfully:", data);
        
        setStep(1);
        setMessage("");

        // console.log("Reset password clicked");
    };

    return (
        <View style={[styles.container, { paddingTop: FIXED_BAR_HEIGHT }]}>
            <Pressable
                onPress={() => router.back()}
                style={[styles.backButton, { top: insets.top + 4 }]}
            >
                <AltArrowLeft size={32} color="#eee" />
            </Pressable>

            <View style={styles.section}>
                <View style={styles.button}>
                    <AvatarNoPress data={data} size={48} />
                    <View style={{ flex: 1 }}>
                        <TextDefault
                            style={[styles.textDefault, { fontWeight: "bold" }]}
                        >
                            {data.name}
                        </TextDefault>
                        <TextDefault
                            style={[styles.textDefault, { opacity: 0.6 }]}
                        >
                            @{data.username}
                        </TextDefault>
                    </View>
                </View>
            </View>
            <View style={[styles.section, { padding: 16 }]}>
                <TextDefault style={[styles.textDefault, styles.title]}>
                    Senha definida
                </TextDefault>
                <TextDefault style={[styles.textDefault]}>
                    {Array.isArray(accountData)
                        ? accountData.some(
                              (account: any) =>
                                  account.providerId === "credential" &&
                                  !!account.password,
                          )
                            ? "Sim"
                            : "Não"
                        : accountData?.providerId === "credential" &&
                            !!accountData?.password
                          ? "Sim"
                          : "Não"}
                </TextDefault>
            </View>

            {step === 0 && (
                <View style={[styles.section, { padding: 16 }]}>
                    <TextDefault
                        style={[
                            styles.textDefault,
                            // styles.title,
                            { marginBottom: 8 },
                        ]}
                    >
                        Para redefinir sua senha, precisamos que verifique seu
                        email.
                    </TextDefault>

                    <Pressable
                        onPress={handleResetPassword}
                        style={[
                            styles.button,
                            { marginTop: 16, backgroundColor: "#8065ef" },
                        ]}
                    >
                        <TextDefault
                            style={[
                                styles.textDefault,
                                { color: "#fff", fontWeight: "bold" },
                            ]}
                        >
                            Verificar
                        </TextDefault>
                    </Pressable>
                </View>
            )}

            {step === 1 && (
                <VerifyToken userData={userData} setStep={setStep} />
            )}

            {step === 2 && (
                <View style={[styles.section, { padding: 16 }]}>
                    <TextDefault
                        style={[
                            styles.textDefault,
                            // styles.title,
                            { marginBottom: 16 },
                        ]}
                    >
                        Defina uma senha para sua conta.
                    </TextDefault>
                    <TextDefault
                        style={[
                            styles.textDefault,
                            // styles.title,
                            { marginBottom: 8 },
                        ]}
                    >
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
                                { color: isLengthOk ? "#4caf50" : "#eee" },
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
                                { color: isCharOk ? "#4caf50" : "#eee" },
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
                                { color: isSpecialCharOk ? "#4caf50" : "#eee" },
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

                    {/* {accountData.password && (
                        <View style={{ marginBottom: 16 }}>
                            <TextDefault
                                style={[
                                    styles.textDefault,
                                    styles.title,
                                    { marginBottom: 4 },
                                ]}
                            >
                                Senha atual
                            </TextDefault>
                            <PasswordInput
                                placeholder="Senha atual"
                                value={currentPassword}
                                onChangeText={handleCurrentPassword}
                            />
                        </View>
                    )} */}

                    <TextDefault
                        style={[
                            styles.textDefault,
                            styles.title,
                            { marginBottom: 4 },
                        ]}
                    >
                        Nova senha
                    </TextDefault>
                    <PasswordInput
                        placeholder="Nova senha"
                        value={newPassword}
                        onChangeText={handleChangePassword}
                    />
                    <TextDefault
                        style={[
                            styles.textDefault,
                            styles.title,
                            { marginBottom: 4, marginTop: 16 },
                        ]}
                    >
                        Confirmar senha
                    </TextDefault>
                    <PasswordInput
                        placeholder="Confirmar senha"
                        value={confirmPassword}
                        onChangeText={handleConfirmPassword}
                    />
                    <Pressable
                        onPress={handleSetPassword}
                        style={[
                            styles.button,
                            {
                                marginTop: 16,
                                backgroundColor: "#8065ef",
                                opacity:
                                    !isLengthOk ||
                                    !isCharOk ||
                                    !isSpecialCharOk ||
                                    !isEqual
                                        ? 0.6
                                        : 1,
                            },
                        ]}
                        disabled={
                            !isLengthOk ||
                            !isCharOk ||
                            !isSpecialCharOk ||
                            !isEqual
                        }
                    >
                        <TextDefault
                            style={[
                                styles.textDefault,
                                { color: "#fff", fontWeight: "bold" },
                            ]}
                        >
                            Salvar
                        </TextDefault>
                    </Pressable>
                </View>
            )}
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        padding: 16,
        width: "100%",
    },

    textDefault: {
        color: "#eee", // A cor clara para o seu modo escuro
        fontSize: 16,
    },
    title: {
        color: "#989898",
        fontSize: 14,
        fontWeight: "bold",
    },
    section: {
        backgroundColor: "#1b1c1d",
        padding: 0,
        borderRadius: 12,
        overflow: "hidden",
    },
    button: {
        backgroundColor: "transparent",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        borderRadius: 12,
    },
    divider: {
        height: 1,
        backgroundColor: "#2c2d2e",
        marginHorizontal: 16,
    },
    backButton: {
        position: "absolute",
        left: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
        // backgroundColor: "rgba(255,255,255,0.05)",
    },
    input: {
        marginBottom: 16,
    },
});
