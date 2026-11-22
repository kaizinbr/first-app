import ProfileTabs from "@/components/profile/profile-tabs";
import api from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Palette, UserProfile } from "@/lib/types";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { darkenColor } from "@/lib/util/workWithColors";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { getColors } from "react-native-image-colors";


import { useUser } from "@/lib/queries/user";
import usePalette from "@/lib/util/usePalette";
import TextDefault from "@/components/core/text-core";

export default function UserProfilePage() {
    const { username } = useLocalSearchParams();
    console.log("Username from params:", username);
    const { data: session } = authClient.useSession();

    const [loading, setLoading] = useState(true);
    const { data: userData, isLoading, isError, isPending } = useUser(username as string);
    const itsMe = userData?.id === session?.user?.id;
    
    return (
        <View style={styles.container}>
            {isPending ? (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#8065ef" />
                </View>
            ) : <View style={styles.main}>
                    <ProfileTabs
                        data={userData}
                        itsUser={itsMe}
                    />
                </View>}

            {isError && (
                <View style={styles.overlay}>
                    <TextDefault style={styles.textDefault}>Erro ao carregar o perfil.</TextDefault>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: "#161718",
        color: "#eeeeee",
        alignItems: "center",
        width: "100%",
    },
    main: {
        flex: 1,
        backgroundColor: "#161718",
        color: "#eeeeee",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        padding: 16,
        width: "100%",
        color: "#eee",
        borderRadius: 8,
    },
    textDefault: {
        color: "#eee", // A cor clara para o seu modo escuro
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
    },
    image: {
        width: "100%",
        height: 300,
        marginTop: 20,
        resizeMode: "contain",
    },
    overlayContainer: {
        flex: 1,
        justifyContent: "center",
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
});
