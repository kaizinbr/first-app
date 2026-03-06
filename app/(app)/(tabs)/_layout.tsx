import Icon from "@/components/core/Icon";
import { authClient } from "@/lib/auth-client";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsDynamicLayout() {
    const { data: session } = authClient.useSession();
    const isLoggedIn = !!session;

    return (
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
