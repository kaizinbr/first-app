import ConfirmModal from "@/components/core/confirm-modal";
import * as React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { AvatarNoPress } from "@/components/core/avatar";

import { CodeSquareIcon } from "@solar-icons/react-native/bold/code-square";
import { InfoSquareIcon } from "@solar-icons/react-native/bold/info-square";
import { LetterIcon } from "@solar-icons/react-native/bold/letter";
import { LockPasswordIcon } from "@solar-icons/react-native/bold/lock-password";
import { Logout2Icon } from "@solar-icons/react-native/bold/logout-2";
import { QuestionSquareIcon } from "@solar-icons/react-native/bold/question-square";
import { ShieldCheckIcon } from "@solar-icons/react-native/bold/shield-check";
import { UserIcon } from "@solar-icons/react-native/bold/user";

import { UserProfile } from "@/lib/types";
import { AltArrowLeftIcon } from "@solar-icons/react-native/outline/alt-arrow-left";
import { AltArrowRightIcon as AltArrowRight } from "@solar-icons/react-native/outline/alt-arrow-right";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { authClient } from "@/lib/auth-client";

import TextDefault from "@/components/core/text-core";

export default function Menu({
    data,
    accountData,
}: {
    data: UserProfile;
    accountData: any;
}) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const FIXED_BAR_HEIGHT = insets.top + 50;

    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const handleLogOut = async () => {
        try {
            setIsLoading(true);
            // await api.delete(`/reviews/${reviewData.id}`, {
            //     method: "DELETE",
            // });
            await authClient.signOut();
            router.back();
            setIsLoading(false);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: FIXED_BAR_HEIGHT }]}>
            <Pressable
                onPress={() => router.back()}
                style={[styles.backButton, { top: insets.top + 4 }]}
            >
                <AltArrowLeftIcon size={32} color="#eee" />
            </Pressable>
            {/* <Text style={styles.title}>Conta</Text> */}
            <View style={styles.section}>
                <Pressable
                    style={styles.button}
                    onPress={() => {
                        router.push("/(app)/edit-profile");
                    }}
                >
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
                    <AltArrowRight size={24} color="#eee" />
                </Pressable>
            </View>
            <View style={styles.section}>
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        {
                            backgroundColor: pressed
                                ? "rgba(255, 255, 255, 0.05)"
                                : "transparent",
                        },
                    ]}
                    onPress={() => {
                        router.push("/(app)/settings/account");
                    }}
                >
                    <UserIcon size={24} color="#eee" />
                    <TextDefault style={styles.textDefault}>
                        Informações da conta
                    </TextDefault>
                </Pressable>
                <View style={styles.divider} />
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        {
                            backgroundColor: pressed
                                ? "rgba(255, 255, 255, 0.05)"
                                : "transparent",
                        },
                    ]}
                    onPress={() => {
                        router.push("/(app)/settings/password");
                    }}
                >
                    <LockPasswordIcon size={24} color="#eee" />
                    <TextDefault style={styles.textDefault}>
                        Configurações de senha
                    </TextDefault>
                </Pressable>

                <View style={styles.divider} />

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        {
                            backgroundColor: pressed
                                ? "rgba(255, 255, 255, 0.05)"
                                : "transparent",
                            opacity: 0.6,
                        },
                    ]}
                >
                    <LetterIcon size={24} color="#eee" />
                    <TextDefault style={styles.textDefault}>
                        Alterar e-mail
                    </TextDefault>
                </Pressable>
            </View>
            <View style={styles.section}>
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        {
                            backgroundColor: pressed
                                ? "rgba(255, 255, 255, 0.05)"
                                : "transparent",
                        },
                    ]}
                    onPress={() => {
                        router.push("/(app)/settings/help");
                    }}
                >
                    <QuestionSquareIcon size={24} color="#eee" />
                    <TextDefault style={styles.textDefault}>Ajuda</TextDefault>
                </Pressable>

                <View style={styles.divider} />
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        {
                            backgroundColor: pressed
                                ? "rgba(255, 255, 255, 0.05)"
                                : "transparent",
                        },
                    ]}
                    onPress={() => {
                        router.push("/(app)/settings/about");
                    }}
                >
                    <InfoSquareIcon size={24} color="#eee" />
                    <TextDefault style={styles.textDefault}>Sobre</TextDefault>
                </Pressable>

                <View style={styles.divider} />
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        {
                            backgroundColor: pressed
                                ? "rgba(255, 255, 255, 0.05)"
                                : "transparent",
                        },
                    ]}
                    onPress={() => {
                        router.push("/(app)/settings/policy");
                    }}
                >
                    <ShieldCheckIcon size={24} color="#eee" />
                    <TextDefault style={styles.textDefault}>
                        Privacidade
                    </TextDefault>
                </Pressable>

                <View style={styles.divider} />

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        {
                            backgroundColor: pressed
                                ? "rgba(255, 255, 255, 0.05)"
                                : "transparent",
                        },
                    ]}
                    onPress={() => {
                        router.push("/(app)/settings/app-infos");
                    }}
                >
                    <CodeSquareIcon size={24} color="#eee" />
                    <TextDefault style={styles.textDefault}>
                        Nerdices do App
                    </TextDefault>
                </Pressable>
            </View>
            <View style={styles.section}>
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        {
                            backgroundColor: pressed
                                ? "rgba(255, 255, 255, 0.05)"
                                : "transparent",
                        },
                    ]}
                    onPress={() => {
                        router.push("/(app)/settings/teste");
                    }}
                >
                    <QuestionSquareIcon size={24} color="#eee" />
                    <TextDefault style={styles.textDefault}>
                        Área de teste
                    </TextDefault>
                </Pressable>
            </View>
            <View style={styles.section}>
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        {
                            backgroundColor: pressed
                                ? "rgba(255, 255, 255, 0.05)"
                                : "transparent",
                        },
                    ]}
                    onPress={() => setShowDeleteModal(true)}
                >
                    <Logout2Icon size={24} color="#fa5252" />
                    <TextDefault
                        style={[styles.textDefault, { color: "#fa5252" }]}
                    >
                        Sair
                    </TextDefault>
                </Pressable>
            </View>

            <ConfirmModal
                visible={showDeleteModal}
                title="Sair da conta"
                message="Você tem certeza que deseja sair da sua conta?"
                confirmLabel="Sair"
                cancelLabel="Cancelar"
                confirmDestructive
                onConfirm={() => {
                    handleLogOut();
                    setShowDeleteModal(false);
                }}
                onCancel={() => setShowDeleteModal(false)}
            />
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
        backgroundColor: "#212223",
        padding: 0,
        borderRadius: 12,
        overflow: "hidden",
    },
    button: {
        backgroundColor: "transparent",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
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
});
