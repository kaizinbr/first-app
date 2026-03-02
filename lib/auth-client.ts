import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
    baseURL: "https://mobile-backend-psi.vercel.app", 
    plugins: [
        expoClient({
            scheme: "firstapp",
            storagePrefix: "firstapp",
            storage: SecureStore,
        }),
    ],
});
