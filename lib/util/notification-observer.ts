import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";

export default function NotificationObserver() {
    useEffect(() => {
        const subscription =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    const data = response.notification.request.content.data;

                    console.log("Notification data:", data);

                    if (data?.type === "new_review") {
                        router.push({
                            pathname: "/(app)/(tabs)/(drafts)/review/[id]",
                            params: { id: data.reviewId as string },
                        });
                    } else if (data?.type === "like") {
                        router.push({
                            pathname: "/(app)/(tabs)/(ahome)/review/[id]",
                            params: { id: data.reviewId as string },
                        });
                    } else if (data?.type === "comment") {
                        router.push({
                            pathname: "/(app)/(tabs)/(ahome)/review/[id]",
                            params: { id: data.reviewId as string },
                        });
                    } else if (data?.type === "mention") {
                        router.push({
                            pathname: "/(app)/(tabs)/(ahome)/review/[id]",
                            params: { id: data.reviewId as string },
                        });
                    } else if (data?.type === "follow") {
                        router.push({
                            pathname: "/(app)/(tabs)/(ahome)/user/[username]",
                            params: { username: data.username as string },
                        });
                    }

                    // if (data?.url) {
                    //     router.push(data?.url as string);
                    // }
                },
            );

        return () => subscription.remove();
    }, []);

    return null;
}
