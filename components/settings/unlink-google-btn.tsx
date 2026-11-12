import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Pressable,
} from "react-native";
import { Image } from "expo-image";
import Button from "@/components/button";
import { authClient } from "@/lib/auth-client";
import api from "@/lib/api";
import { useEffect, useState } from "react";


import { TrashBinMinimalisticIcon } from '@solar-icons/react-native/linear/trash-bin-minimalistic'
import AntDesign from "@expo/vector-icons/AntDesign";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import TextDefault from "@/components/core/text-core";

import ConfirmModal from "@/components/core/confirm-modal";

export default function UnlinkGoogleBtn({
    setAccounts,
    accounts,
}: {
    setAccounts: React.Dispatch<React.SetStateAction<any>>;
    accounts: any;
}) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUnlinkGoogle = () => {
        setShowConfirmModal(true);
    };

    const confirmUnlinkGoogle = async () => {
        try {
            const accounts = await authClient.listAccounts();

            const googleAccount = accounts?.data?.find(
                (account) => account.providerId === "google",
            );

            if (!googleAccount) {
                return;
            }
            
            await authClient.unlinkAccount({
                accountId: googleAccount.id,
            });

            setAccounts(accounts);
        } catch (error) {
            console.error("Error unlinking Google account:", error);
        } finally {
            setShowConfirmModal(false);
        }
    };

    return (
        <>
            <View style={[styles.btnBg]}>
                <AntDesign name="google" size={24} color="#eee" />
                <View
                    style={{
                        flex: 1,
                        marginLeft: 8,
                        paddingRight: 8,
                    }}
                >
                    <TextDefault style={styles.btnText}>
                        Conta Google conectada
                    </TextDefault>
                </View>
                {accounts.data.some(
                    (account: any) => account.providerId === "credential",
                ) ? (
                    <Pressable onPress={handleUnlinkGoogle}>
                        <TrashBinMinimalisticIcon size={24} color="#eee" />
                    </Pressable>
                ) : null}
            </View>
            <ConfirmModal
                visible={showConfirmModal}
                title="Desconectar Conta Google"
                message="Tem certeza de que deseja desconectar sua conta do Google?"
                onConfirm={confirmUnlinkGoogle}
                onCancel={() => setShowConfirmModal(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        padding: 16,
        gap: 12,
    },
    overlay: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        backgroundColor: "#161718",
        zIndex: 10,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    statusBarBg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        zIndex: 10,
    },
    backButton: {
        position: "absolute",
        left: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
    },
    btnBg: {
        backgroundColor: "#212223",
        padding: 12,
        borderRadius: 12,
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    btnText: {
        color: "#eee",
        fontWeight: "600",
    },
});
