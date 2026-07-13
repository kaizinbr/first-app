import { AvatarNoPress } from "@/components/core/avatar";
import NotsBtn from "@/components/core/nots-btn";
import { apiAuth } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import NotificationObserver from "@/lib/util/notification-observer";
import {
    HomeSmileAngleBold,
    MinimalisticMagnifierBold,
    UserBold,
    LibraryBold,
    MinimalisticMagnifierOutline,
    HomeSmileAngleOutline,
    LibraryOutline,
} from "@solar-icons/react-native";
// IMPORTANTE: Adicionamos o useFocusEffect diretamente do expo-router
import { Redirect, Tabs, useRouter, useFocusEffect } from "expo-router";
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { BlurTargetView, BlurView } from "expo-blur";

// 1. Contexto para trafegar o Ref da tela ativa para a TabBar
const ActiveBlurRefContext = createContext<((ref: any) => void) | null>(null);

// 2. Wrapper Inteligente compatível com SDK 56+
function TabScreenWrapper({ children }: { children: React.ReactNode }) {
    const localRef = useRef<View | null>(null);
    const setActiveRef = useContext(ActiveBlurRefContext);
    
    // Rastreamos o foco da tela usando o hook nativo do expo-router
    const [isFocused, setIsFocused] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setIsFocused(true);
            return () => setIsFocused(false);
        }, [])
    );

    // Garantimos que a Tab Bar receba a referência tanto na montagem da view quanto no ganho de foco
    const handleRef = useCallback((view: View | null) => {
        localRef.current = view;
        if (view && isFocused && setActiveRef) {
            setActiveRef(localRef);
        }
    }, [isFocused, setActiveRef]);

    useEffect(() => {
        if (isFocused && localRef.current && setActiveRef) {
            setActiveRef(localRef);
        }
    }, [isFocused, setActiveRef]);

    return (
        <BlurTargetView style={{ flex: 1, backgroundColor: "#161718" }} ref={handleRef}>
            {children}
        </BlurTargetView>
    );
}

export default function TabsDynamicLayout() {
    const router = useRouter();

    // 3. O Estado que guarda o ref da tela que está ativa no momento
    const [activeBlurRef, setActiveBlurRef] = useState<any>(null);

    const { data: session, isPending } = authClient.useSession();
    const [profile, setProfile] = useState<any>(null);
    const [isProfilePublic, setIsProfilePublic] = useState<boolean | null>(null);
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
            } catch (error) {
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

    if (!session) return <Redirect href="/(auth)/sign-in" />;
    if (isProfilePublic === false) return <Redirect href="/(app)/onboarding" />;

    return (
        <ActiveBlurRefContext.Provider value={setActiveBlurRef}>
            <NotificationObserver />
            <Tabs
                initialRouteName="(ahome)"
                screenLayout={({ children }) => (
                    <TabScreenWrapper>{children}</TabScreenWrapper>
                )}
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: styles.tabBar,
                    tabBarItemStyle: styles.tabBarItem,
                    tabBarIconStyle: styles.tabBarIcon,
                    tabBarActiveTintColor: "#8065ef",
                    tabBarBackground: () => (
                        activeBlurRef ? (
                            <BlurView
                                intensity={100}
                                tint="dark"
                                blurTarget={activeBlurRef}
                                blurMethod="dimezisBlurView"
                                style={[
                                    StyleSheet.absoluteFill,
                                    { overflow: "hidden" },
                                ]}
                            />
                        ) : (
                            <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(22, 23, 24, 0.85)" }]} />
                        )
                    ),
                }}
            >
                <Tabs.Screen
                    name="(ahome)"
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ color, focused }) =>
                            focused ? (
                                <HomeSmileAngleBold size={28} color={color as string} strokeWidth={2} />
                            ) : (
                                <HomeSmileAngleOutline size={28} color={color as string} strokeWidth={2} />
                            ),
                    }}
                />
                <Tabs.Screen
                    name="(search)"
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ color, focused }) =>
                            focused ? (
                                <MinimalisticMagnifierBold size={28} color={color as string} strokeWidth={2} />
                            ) : (
                                <MinimalisticMagnifierOutline size={28} color={color as string} strokeWidth={2} />
                            ),
                    }}
                />
                <Tabs.Screen
                    name="(drafts)"
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ color, focused }) =>
                            focused ? (
                                <LibraryBold size={28} color={color as string} strokeWidth={2} />
                            ) : (
                                <LibraryOutline size={28} color={color as string} strokeWidth={2} />
                            ),
                    }}
                />
                <Tabs.Screen
                    name="(notifications)"
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ color, focused }) => (
                            <NotsBtn color={color as string} focused={focused} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="(profile)"
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ color }) =>
                            profile ? (
                                <AvatarNoPress data={profile} size={28} />
                            ) : (
                                <UserBold size={28} color={color as string} />
                            ),
                    }}
                />
            </Tabs>
        </ActiveBlurRefContext.Provider>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: 56,
        position: "absolute",
        backgroundColor: "transparent",
        elevation: 0,
        shadowOpacity: 0,
        borderTopWidth: 0,
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
        flex: 1,
    },
});