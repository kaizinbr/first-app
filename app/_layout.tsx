import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { authClient } from "@/lib/auth-client";

export default function Layout() {
    const { data: session } = authClient.useSession();
    const isLoggedIn = !!session;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Protected guard={!isLoggedIn}>
                    <Stack.Screen name="sign-in" />
                    <Stack.Screen name="sign-up" />
                </Stack.Protected>

                <Stack.Protected guard={isLoggedIn}>
                    <Stack.Screen name="(app)" options={{ headerShown: false }} />
                </Stack.Protected>
            </Stack>
        </SafeAreaView>
    );
}
