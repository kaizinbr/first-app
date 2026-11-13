import { useEffect, type ReactNode } from "react";
import { AppState, Platform } from "react-native";
import Constants from "expo-constants";
import * as Network from "expo-network";
import { focusManager, onlineManager } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { persister, queryClient } from "@/lib/cache";

onlineManager.setEventListener((setOnline) => {
    const subscription = Network.addNetworkStateListener((state) => {
        setOnline(!!state.isConnected);
    });
    return () => subscription.remove();
});

export default function QueryProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        const subscription = AppState.addEventListener("change", (status) => {
            if (Platform.OS !== "web") {
                focusManager.setFocused(status === "active");
            }
        });
        return () => subscription.remove();
    }, []);

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister,
                maxAge: 1000 * 60 * 60 * 24 * 7,
                buster: Constants.expoConfig?.version ?? "0",
                dehydrateOptions: {
                    shouldDehydrateQuery: (query) =>
                        query.state.status === "success" && query.meta?.persistir !== false,
                },
            }}
        >
            {children}
        </PersistQueryClientProvider>
    );
}