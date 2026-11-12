import api from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Redirect, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { AvatarNoPress } from "@/components/core/avatar";
import NotsBtn from "@/components/core/nots-btn";

import { HomeSmileAngleIcon } from '@solar-icons/react-native/bold/home-smile-angle'
import { HomeSmileAngleIcon as HomeSmileAngleOutline } from '@solar-icons/react-native/outline/home-smile-angle'
import { LibraryIcon } from '@solar-icons/react-native/bold/library'
import { LibraryIcon as LibraryOutline } from '@solar-icons/react-native/outline/library'
import { MinimalisticMagnifierIcon } from '@solar-icons/react-native/bold/minimalistic-magnifier'
import { MinimalisticMagnifierIcon as MinimalisticMagnifierOutline } from '@solar-icons/react-native/outline/minimalistic-magnifier'
import { UserIcon } from '@solar-icons/react-native/bold/user'


import NotificationObserver from "@/lib/util/notification-observer";
import { useRouter } from "expo-router";

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
                const response = await api.get("/me");
                setIsProfilePublic(response.data.public);
                setProfile(response.data);
                console.log("Perfil do usuário:", response.data.public);
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
                // 'initialRouteName'="(ahome)"
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: styles.tabBar,
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
                                <HomeSmileAngleIcon
                                    size={26}
                                    color={color as string}
                                    strokeWidth={2}
                                />
                            ) : (
                                <HomeSmileAngleOutline
                                    size={24}
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
                                <MinimalisticMagnifierIcon
                                    size={26}
                                    color={color as string}
                                    strokeWidth={2}
                                />
                            ) : (
                                <MinimalisticMagnifierOutline
                                    size={24}
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
                                <LibraryIcon
                                    size={26}
                                    color={color as string}
                                    strokeWidth={2}
                                />
                            ) : (
                                <LibraryOutline
                                    size={24}
                                    color={color as string}
                                    strokeWidth={2}
                                />
                            ),
                    }}
                />
                <Tabs.Screen
                    name="(notifications)"
                    options={{
                        href: null,
                        headerShown: false,
                        tabBarLabel: () => null,
                        tabBarIcon: ({ color, focused }) => (
                            <NotsBtn
                                color={color as string}
                                focused={focused}
                            />
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
                                <AvatarNoPress
                                    data={profile}
                                    size={24}
                                    // focused={focused}
                                />
                            ) : (
                                <UserIcon size={24} color={color as string} />
                            ),
                    }}
                />
            </Tabs>
        </>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        // height: 56,
        // position: "absolute",
        backgroundColor: "#161718",
        paddingVertical: 16,
        minHeight: 64,
        bottom: 0,
        // elevation: 0,
        // shadowOpacity: 0,
        // borderTopWidth: 0,
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
        height: "100%",
        flex: 1,
    },
});
