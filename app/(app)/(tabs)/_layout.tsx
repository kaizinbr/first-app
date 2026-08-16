import Icon from "@/components/core/Icon";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Tabs, Redirect, Stack } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";

import {
    HomeSmileAngleBold,
    MinimalisticMagnifierBold,
    UserBold,
    LibraryBold,
    BellBold,
    MinimalisticMagnifierOutline,
    HomeSmileAngleOutline,
    UserOutline,
    LibraryOutline,
} from "@/lib/solar-icons";
import { apiAuth } from "@/lib/api";
import { AvatarNoPress } from "@/components/core/avatar";
import NotificationObserver from "@/lib/util/notification-observer";
import { useRouter } from "expo-router";
import NotsBtn from "@/components/core/nots-btn";


export default function TabsDynamicLayout() {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();
    const isLoggedIn = !!session;
    // console.log(isLoggedIn);
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
                router.push("/(app)/offline");
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
                <ActivityIndicator size="large" color="#8065ef" />
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
            <NotificationObserver />
            <Tabs
                initialRouteName="(ahome)"
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: styles.tabBar,
                    tabBarItemStyle: styles.tabBarItem,
                    tabBarIconStyle: styles.tabBarIcon,
                    tabBarActiveTintColor: "#8065ef",
                }}
            >
                <Tabs.Screen
                    name="(ahome)"
                    options={{
                        headerShown: false,
                        tabBarLabel: () => null,
                        tabBarIcon: ({ color, focused }) =>
                            focused ? (
                                <HomeSmileAngleBold
                                    size={28}
                                    color={color as string}
                                    strokeWidth={2}
                                />
                            ) : (
                                <HomeSmileAngleOutline
                                    size={26}
                                    color={color as string}
                                    strokeWidth={2}
                                />
                            ),
                    }}
                />
                <Tabs.Screen
                    name="(search)"
                    options={{
                        headerShown: false,
                        tabBarLabel: () => null,
                        tabBarIcon: ({ color, focused }) =>
                            focused ? (
                                <MinimalisticMagnifierBold
                                    size={28}
                                    color={color as string}
                                    strokeWidth={2}
                                />
                            ) : (
                                <MinimalisticMagnifierOutline
                                    size={26}
                                    color={color as string}
                                    strokeWidth={2}
                                />
                            ),
                    }}
                />
                <Tabs.Screen
                    name="(drafts)"
                    options={{
                        headerShown: false,
                        tabBarLabel: () => null,
                        tabBarIcon: ({ color, focused }) =>
                            focused ? (
                                <LibraryBold
                                    size={28}
                                    color={color as string}
                                    strokeWidth={2}
                                />
                            ) : (
                                <LibraryOutline
                                    size={26}
                                    color={color as string}
                                    strokeWidth={2}
                                />
                            ),
                    }}
                />
                <Tabs.Screen
                    name="(notifications)"
                    options={{
                        headerShown: false,
                        tabBarLabel: () => null,
                        tabBarIcon: ({ color, focused }) => (
                            <NotsBtn color={color as string} focused={focused} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="(profile)"
                    options={{
                        headerShown: false,
                        tabBarLabel: () => null,
                        tabBarIcon: ({ color, focused }) =>
                            profile ? (
                                <AvatarNoPress data={profile} size={26} focused={focused} />
                            ) : (
                                <UserBold size={26} color={color as string} />
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
        elevation: 0,
        shadowOpacity: 0,
        borderTopWidth: 0,
    },
    tabBarBlur: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        overflow: "hidden",
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
