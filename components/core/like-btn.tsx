import * as React from "react";
import { View, Text, StyleSheet, Pressable, Share, Alert } from "react-native";
import {
    Heart as HeartOutline,
} from "@solar-icons/react-native/Outline";
import { Heart } from '@solar-icons/react-native/Bold'
import { ReviewWithAlbum } from "@/lib/types";

export default function LikeBtn({ review }: { review: ReviewWithAlbum }) {
    // const onShare = async () => {
    //     console.log("Shared successfully");
    //     try {
    //         const result = await Share.share({
    //             message: url,
    //         });
    //         if (result.action === Share.sharedAction) {
    //             if (result.activityType) {
    //                 // shared with activity type of result.activityType
    //             } else {
    //                 // shared
    //             }
    //         } else if (result.action === Share.dismissedAction) {
    //             // dismissed
    //         }
    //     } catch (error: any) {
    //         Alert.alert(error.message);
    //     }
    // };

    return (
        <Pressable style={styles.confBtn} onPress={() => {}}>
            <HeartOutline size={24} color="#eee" />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    confBtn: {
        width: 28,
        height: 28,
        justifyContent: "center",
        alignItems: "flex-end",
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
