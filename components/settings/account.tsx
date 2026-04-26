import * as React from "react";
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
import { AltArrowRight, AltArrowLeft } from "@solar-icons/react-native/Outline";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AvatarNoPress } from "@/components/core/avatar";
import { useRouter } from "expo-router";

import TextDefault from "@/components/core/text-core";

export default function Account({
    data,
    userData,
}: {
    data: UserProfile;
    userData: any;
}) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const FIXED_BAR_HEIGHT = insets.top + 50;

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
                    ID de usuário
                </TextDefault>
                <TextDefault style={[styles.textDefault]}>
                    {data.id}
                </TextDefault>
                <TextDefault
                    style={[
                        styles.textDefault,
                        styles.title,
                        { marginTop: 16 },
                    ]}
                >
                    Email
                </TextDefault>
                <TextDefault style={[styles.textDefault]}>
                    {userData.email}
                </TextDefault>
                <TextDefault
                    style={[
                        styles.textDefault,
                        styles.title,
                        { marginTop: 16 },
                    ]}
                >
                    Email verificado
                </TextDefault>
                <TextDefault style={[styles.textDefault]}>
                    {userData.email_verified ? "Sim" : "Não"}
                </TextDefault>
                <TextDefault
                    style={[
                        styles.textDefault,
                        styles.title,
                        { marginTop: 16 },
                    ]}
                >
                    Senha definida
                </TextDefault>
                <TextDefault style={[styles.textDefault]}>
                    {userData.encrypted_password ? "Sim" : "Não"}
                </TextDefault>
                <TextDefault
                    style={[
                        styles.textDefault,
                        styles.title,
                        { marginTop: 16 },
                    ]}
                >
                    Conta criada em
                </TextDefault>
                <TextDefault style={[styles.textDefault]}>
                    {new Date(data.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })}
                </TextDefault>
            </View>
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
