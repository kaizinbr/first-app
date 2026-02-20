import Icon from "@/components/core/Icon";
import { authClient } from "@/lib/auth-client";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    tabBar: {
        height: 56,
    },
    tabBarItem: {
        borderRadius: 8,
        // height: 56,
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

export default function TabsLayout() {
    const { data: session } = authClient.useSession();
    const isLoggedIn = !!session;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabBarItem,
                tabBarIconStyle: styles.tabBarIcon,
            }}
        >
            <Tabs.Screen
                name="index"
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
                name="search"
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
                name="profile"
                options={{
                    headerShown: false,
                    title: "Perfil",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="user" size={24} color={color} />
                    ),
                }}
            />
            
            <Tabs.Screen
                name="user/[username]"
                options={{
                    href: null
                }}
            />
            <Tabs.Screen
                name="review/[shorten]"
                options={{
                    href: null
                }}
            />
            <Tabs.Screen
                name="album/[id]"
                options={{
                    href: null
                }}
            />
            <Tabs.Screen
                name="artist/[id]"
                options={{
                    href: null
                }}
            />
        </Tabs>
    );
}
