import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";

export default function NotificationObserver() {
    useEffect(() => {
        const subscription =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    const data = response.notification.request.content.data;

                    if (data?.url) {
                        router.push(data?.url as string);
                    }
                },
            );

        return () => subscription.remove();
    }, []);

    return null;
}
