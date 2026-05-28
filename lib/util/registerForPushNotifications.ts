import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { apiAuthPost } from "@/lib/api";

// Como o handler processa notificações quando o app está aberto
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotifications(): Promise<string | null> {
    
    // if (!Device.isDevice) return null; // emulador não funciona

    const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") return null;

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
        });
    }

    const token = await Notifications.getExpoPushTokenAsync({
        projectId: "a1236a00-ff58-44a6-b648-34ca61371df0",
    });

    const response = await apiAuthPost("/push-tokens", {
        token: token.data,
    });

    return token.data; // salva isso no teu backend associado ao userId
}
