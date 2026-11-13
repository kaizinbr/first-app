import { createMMKV } from "react-native-mmkv";
import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

export const storage = createMMKV({ id: "cache" });

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,
            gcTime: 1000 * 60 * 60 * 24 * 7,
            retry: 1,
        },
    },
});

export const persister = createAsyncStoragePersister({
    storage: {
        getItem: (key) => storage.getString(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
        removeItem: (key) => {
            storage.remove(key);
        },
    },
    throttleTime: 3000,
});

export async function limparCache() {
    queryClient.clear();
    await persister.removeClient();
}