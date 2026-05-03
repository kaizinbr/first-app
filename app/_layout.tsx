import { Stack } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { authClient } from "@/lib/auth-client";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme, View, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();
export default function Layout() {
    const { data: session } = authClient.useSession();
    console.log("Session data in layout:", session);
    const isLoggedIn = false;
    console.log("Is user logged in?", isLoggedIn);
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
            <SafeAreaProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <BottomSheetModalProvider>
                        <SafeAreaView edges={["bottom", "left", "right"]} style={{ flex: 1, backgroundColor: MyTheme.colors.background }}>
                            <StatusBar style="light" translucent={true} />
                            
                            {/* DEIXE O STACK LIMPO E ESTÁTICO */}
                            <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(auth)" />
                            <Stack.Screen name="(app)" />
                        </Stack>

                        </SafeAreaView>
                    </BottomSheetModalProvider>
                </GestureHandlerRootView>
            </SafeAreaProvider>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    headerWrapper: {
        width: "100%",
        height: "100%",
    },
    header: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        zIndex: -10,
        backgroundColor: "transparent",
        marginTop: -100,
    },
    colorOne: {
        width: 150,
        height: 150,
        borderRadius: 9999,
        position: "absolute",
        top: -50,
        left: -50,
        backgroundColor: "#1f64d4",
        filter: "blur(100px)",
    },
});
