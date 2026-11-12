import api from "@/lib/api";
import { BellIcon } from '@solar-icons/react-native/linear/bell'
import { BellIcon as BellBold } from '@solar-icons/react-native/bold/bell'
import { useEffect, useRef, useState } from "react";
import { AppState, View } from "react-native";

const POLL_INTERVAL = 30_000;

export default function NotsBtn({
    color,
    focused,
}: {
    color: string;
    focused: boolean;
}) {
    const [hasUnread, setHasUnread] = useState(false);
    const isFetchingRef = useRef(false);
    const appStateRef = useRef(AppState.currentState);

    async function checkNotifications() {
        if (isFetchingRef.current) return;
        if (appStateRef.current !== "active") return;

        isFetchingRef.current = true;
        try {
            const response = await api.get("/notifications/unread");
            setHasUnread(Boolean(response.data.hasUnread));
        } catch (error) {
            console.error("Erro ao verificar notificações:", error);
        } finally {
            isFetchingRef.current = false;
        }
    }

    useEffect(() => {
        // checkNotifications();

        const subscription = AppState.addEventListener(
            "change",
            (nextState) => {
                appStateRef.current = nextState;

                if (nextState === "active") {
                    checkNotifications();
                }
            },
        );

        const interval = setInterval(() => {
            checkNotifications();
        }, POLL_INTERVAL);

        return () => {
            subscription.remove();
            clearInterval(interval);
        };
    }, []);

    return (
        <View style={{ position: "relative" }}>
            {focused ? (
                <BellBold size={28} color={color as string} />
            ) : (
                <BellIcon size={26} color={color as string} />
            )}
            {hasUnread && (
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 2,
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: "#ef4444",
                        borderWidth: 2,
                        borderColor: "#161718",
                    }}
                />
            )}
        </View>
    );
}
