import * as React from "react";
import { View, Text, StyleSheet, Pressable, Share, Alert } from "react-native";
import {
    AltArrowLeft,
    Settings,
    Share as ShareIcon,
} from "@solar-icons/react-native/Outline";

export default function ShareBtn({ type, url }: { type: string; url: string }) {
    const onShare = async () => {
        console.log("Shared successfully");
        try {
            const result = await Share.share({
                message: url,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    return (
        <Pressable style={styles.confBtn} onPress={onShare}>
            <ShareIcon size={28} color="#eee" />
        </Pressable>
    );
}

export function ShareLargeBtn({
    type,
    url,
    dismiss,
}: {
    type: string;
    url: string;
    dismiss: () => void;
}) {
    const onShare = async () => {
        console.log("Shared successfully");
        try {
            const result = await Share.share({
                message: url,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                    dismiss();
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.optBtn,
                {
                    backgroundColor: pressed
                        ? "rgba(255, 255, 255, 0.05)"
                        : "transparent",
                },
            ]}
            onPress={onShare}
        >
            <ShareIcon size={24} color="#eee" />
            <Text style={styles.optText}>Compartilhar</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    confBtn: {
        width: 40,
        height: 30,
        justifyContent: "center",
        alignItems: "flex-end",
        zIndex: 9999,
        position: "relative",
    },
    title: {
        color: "#eee",
        fontSize: 14,
        fontWeight: "bold",
    },

    optBtn: {
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: "transparent",
        padding: 12,
        width: "100%",
        borderRadius: 8,
    },
    optText: {
        color: "#eee",
        fontSize: 14,
        marginLeft: 12,
    },
});
