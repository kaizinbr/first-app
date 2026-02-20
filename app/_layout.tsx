import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { authClient } from "@/lib/auth-client";
// import { ThemeProvider } from "@/components/theme/context";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

export default function Layout() {
    const { data: session } = authClient.useSession();
    const isLoggedIn = !!session;
    const colorScheme = useColorScheme();

    const MyTheme = {
        ...(colorScheme === "dark" ? DarkTheme : DefaultTheme),
        colors: {
            ...(colorScheme === "dark"
                ? DarkTheme.colors
                : DefaultTheme.colors),
            background: "#161718", // Cor de fundo global
            text: "#eeeeee", // Cor de texto global
            card: "#1e1e1e", // Fundo de componentes como header/tabs
        },
    };

    return (
        <ThemeProvider value={MyTheme}>
            <SafeAreaView style={{ flex: 1, backgroundColor: MyTheme.colors.background }}>
                <StatusBar style="light" />
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Protected guard={!isLoggedIn}>
                        <Stack.Screen name="sign-in" />
                        <Stack.Screen name="sign-up" />
                    </Stack.Protected>

                    <Stack.Protected guard={isLoggedIn}>
                        <Stack.Screen
                            name="(app)"
                            options={{ headerShown: false }}
                        />
                    </Stack.Protected>
                </Stack>
            </SafeAreaView>
        </ThemeProvider>
    );
}
