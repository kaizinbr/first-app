import { authClient } from "@/lib/auth-client";
import { Tabs } from "expo-router";

export default function TabsLayout() {
    const { data: session } = authClient.useSession();
    const isLoggedIn = !!session;

    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ headerShown: false }}/>
            <Tabs.Protected guard={isLoggedIn}>
                <Tabs.Screen name="vip" />
            </Tabs.Protected>
            <Tabs.Screen name="logged" />
            <Tabs.Screen name="home" />
        </Tabs>
    );
}
