import * as React from "react";
import {
    View,
    StyleSheet,
    RefreshControl,
    Text,
    Pressable,
} from "react-native";
import ConfirmModal from "@/components/core/confirm-modal";

import { UserProfile, Palette } from "@/lib/types";
import {
    User,
    LockPassword,
    Letter,
    QuestionSquare,
    Logout2,
} from "@solar-icons/react-native/Bold";
import { AltArrowRight, AltArrowLeft } from "@solar-icons/react-native/Outline";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AvatarNoPress } from "@/components/core/avatar";
import { useRouter } from "expo-router";

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
            // await apiAuthDELETE(`/reviews/${reviewData.id}`, {
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
                <AltArrowLeft size={32} color="#eee" />
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
                    <User size={24} color="#eee" />
                    <TextDefault style={styles.textDefault}>
                        Informações da conta
                    </TextDefault>
                </Pressable>
                <View style={styles.divider} />

                {Array.isArray(accountData) && (
                    accountData.some(
                        (account: any) =>
                            account.providerId === "credential" &&
                            !!account.password,
                    ) ? (
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
                                router.push("/(app)/settings/change-password");
                            }}
                        >
                            <LockPassword size={24} color="#eee" />
                            <TextDefault style={styles.textDefault}>
                                Alterar senha
                            </TextDefault>
                        </Pressable>
                    ) : (
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
                                router.push("/(app)/settings/set-password");
                            }}
                        >
                            <LockPassword size={24} color="#eee" />
                            <TextDefault style={styles.textDefault}>
                                Definir senha
                            </TextDefault>
                        </Pressable>
                    )
                
                )}

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
                >
                    <Letter size={24} color="#eee" />
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
                >
                    <QuestionSquare size={24} color="#eee" />
                    <TextDefault style={styles.textDefault}>Ajuda</TextDefault>
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
                    <Logout2 size={24} color="#fa5252" />
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
