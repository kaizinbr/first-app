import Icon from "@/components/core/Icon";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { Tabs, Redirect, Stack } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiAuth } from "@/lib/api";

export default function TabsDynamicLayout() {
    const { data: session, isPending } = authClient.useSession();
    const isLoggedIn = !!session;

    const [isProfilePublic, setIsProfilePublic] = useState<boolean | null>(
        null,
    );
    const [isProfileLoading, setIsProfileLoading] = useState(true);

    useEffect(() => {
        // Se não tem sessão, não precisamos buscar o perfil
        if (!session) {
            setIsProfileLoading(false);
            return;
        }

        async function checkProfile() {
            try {
                const response = await apiAuth("/me");
                setIsProfilePublic(response.public);
                // console.log("Perfil do usuário:", response.public);
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
                    // tabBarBackground: () => (
                    //     <BlurView
                    //     experimentalBlurMethod="dimezisBlurView" // Use WebGL for better performance on supported platforms
                    //         tint="dark" // Can be "light", "dark", or "default"
                    //         intensity={30} // Adjust the intensity of the blur
                    //         style={StyleSheet.absoluteFill} // Ensures the BlurView covers the entire tab bar area
                    //     />
                    // ),
                }}
            >
                <Tabs.Screen
                    name="(home)"
                    options={{
                        headerShown: false,
                        title: "Home",
                        tabBarIcon: ({ color }) => (
                            <Icon
                                type="home"
                                color={color}
                                size={24}
                                style={{ height: 24, width: 24 }}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="(search)"
                    options={{
                        headerShown: false,
                        title: "Pesquisa",
                        tabBarIcon: ({ color }) => (
                            <Icon
                                type="search"
                                color={color}
                                size={24}
                                style={{ height: 24, width: 24 }}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="(profile)"
                    options={{
                        headerShown: false,
                        title: "Perfil",
                        tabBarIcon: ({ color }) => (
                            <FontAwesome name="user" size={20} color={color} />
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
        margin: 0,
        alignItems: "center",
        justifyContent: "center",
        bottom: 0,
    },
    tabBarIcon: {
        // height: 50,
        width: 24,
    },
});
