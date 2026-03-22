import Icon from "@/components/core/Icon";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { Tabs, Redirect, Stack } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { HomeSmileAngle , MinimalisticMagnifier, User } from '@solar-icons/react-native/Bold'
import { apiAuth } from "@/lib/api";
import {AvatarNoPress} from "@/components/core/avatar";

export default function TabsDynamicLayout() {
    const { data: session, isPending } = authClient.useSession();
    const isLoggedIn = !!session;
    const [profile, setProfile] = useState<any>(null);

    const [isProfilePublic, setIsProfilePublic] = useState<boolean | null>(
        null,
    );
    const [isProfileLoading, setIsProfileLoading] = useState(true);

    useEffect(() => {
        if (!session) {
            setIsProfileLoading(false);
            return;
        }

        async function checkProfile() {
            try {
                const response = await apiAuth("/me");
                setIsProfilePublic(response.public);
                setProfile(response);
                console.log("Perfil do usuário:", response.public);
            } catch (error) {
                console.error("Erro ao buscar perfil:", error);
                setIsProfilePublic(false);
            } finally {
                setIsProfileLoading(false);
            }
        }

        checkProfile();
    }, [session]);

    if (isPending || (session && isProfileLoading)) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#161718",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" color="#00a8ff" />
            </View>
        );
    }

    if (!session) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    if (isProfilePublic === false) {
        return <Redirect href="/(app)/onboarding" />;
    }

    return (
        <>
            {/* <View style={{ position: "absolute", top: 40, left: 20, zIndex: 100 }}>
                <Text>+</Text>
            </View> */}
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: styles.tabBar,
                    tabBarItemStyle: styles.tabBarItem,
                    tabBarIconStyle: styles.tabBarIcon,
                }}
            >
                <Tabs.Screen
                    name="(home)"
                    options={{
                        headerShown: false,
                        tabBarLabel: () => null,
                        tabBarIcon: ({ color }) => (
                            <HomeSmileAngle size={28} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="(search)"
                    options={{
                        headerShown: false,
                        tabBarLabel: () => null,
                        tabBarIcon: ({ color }) => (
                            <MinimalisticMagnifier size={28} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="(profile)"
                    options={{
                        headerShown: false,
                        tabBarLabel: () => null,
                        tabBarIcon: ({ color }) => (
                            profile ? (
                                <AvatarNoPress data={profile} size={28} />
                            ) : (
                                <User size={28} color={color} />
                            )
                        ),
                    }}
                />
            </Tabs>
        </>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: 56,
        position: "absolute",
        backgroundColor: "#161718",
    },
    tabBarItem: {
        borderRadius: 8,
        height: 56,
        width: 56,
        margin: 0,
        alignItems: "center",
        justifyContent: "center",
        bottom: 0,
    },
    tabBarIcon: {
        // height: 50,
        // width: 24,
        flex: 1,
    },
});
