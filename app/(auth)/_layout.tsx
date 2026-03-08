import { Redirect, Stack } from "expo-router";
import { authClient } from "@/lib/auth-client";

export default function AuthLayout() {
    const { data: session } = authClient.useSession();

    if (session) {
        return <Redirect href="/(app)/(tabs)/(home)" />; 
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" />
            <Stack.Screen name="verify-token" />
        </Stack>
    );
}
